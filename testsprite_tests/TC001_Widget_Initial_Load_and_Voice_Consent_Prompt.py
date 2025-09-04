import asyncio
from playwright import async_api

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:5174", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # Check that the widget renders collapsed with a visible and clickable 'Enable voice' chip
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Tap the 'Enable voice' chip to trigger microphone permission prompt
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert the widget is collapsed with 'Enable voice' chip visible and clickable
        frame = context.pages[-1]
        enable_voice_chip = frame.locator('xpath=html/body/div/div/button[contains(text(), "Enable voice")]').first
        assert await enable_voice_chip.is_visible(), "Enable voice chip should be visible"
        assert await enable_voice_chip.is_enabled(), "Enable voice chip should be clickable"
        await enable_voice_chip.click()
        # Verify microphone permission prompt is triggered
        permissions = await context.grant_permissions(['microphone'])
        assert 'microphone' in permissions, "Microphone permission should be requested and granted"
        # Confirm continuous voice listening starts and assistant greeting message is displayed
        greeting_message = frame.locator('text=Hello, how can I assist you?').first
        assert await greeting_message.is_visible(), "Assistant greeting message should be visible after granting microphone permission"
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    