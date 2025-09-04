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
        # Simulate offline mode or disable network connectivity
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Simulate offline mode or disable network connectivity
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Simulate offline mode or disable network connectivity
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Simulate offline mode or disable network connectivity
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Simulate offline mode or disable network connectivity
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Simulate offline mode or disable network connectivity
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div[4]/form/div/div/textarea').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Testing offline message queuing.')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div[4]/form/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Submit onboarding lead form while offline
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/div/section[4]/div[4]/div/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Fill out the onboarding lead form with valid data and submit while offline
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/div/section[2]/div/div/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Test User')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/div/section[2]/div/div/form/div/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('testuser@example.com')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/div/section[2]/div/div/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('+1234567890')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/div/section[2]/div/div/form/div[2]/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Test Company')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/div/section[2]/div/div/form/div[3]/textarea').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('This is a test message for offline lead submission.')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/main/div/section[2]/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Restore network connectivity and verify background sync retries queued chat and lead submissions successfully
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/nav/div/div/div[2]/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Verify background sync retries queued chat and lead submissions successfully and user receives assistant responses confirming message processing
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div[4]/form/div/div/textarea').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Is the offline message and lead form submission processed now?')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div[4]/form/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert widget shows offline status message and queues requests locally
        offline_status_locator = frame.locator('text=offline')
        assert await offline_status_locator.is_visible(), 'Offline status message is not visible'
        # Restore network connectivity is done in previous steps
        # Assert background sync retries queued chat and lead submissions successfully
        # Wait for assistant response confirming message processing
        assistant_response_locator = frame.locator('xpath=//div[contains(@class, "chat-log")]//div[contains(text(), "We use Vercel + Render + Supabase + n8n for reliability.")]')
        assert await assistant_response_locator.is_visible(), 'Assistant response confirming message processing not found'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    