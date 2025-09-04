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
        # Send a TTS request with sample text to /api/tts endpoint to validate audio/mpeg response.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input sample text into the message box and send to trigger /api/tts request.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div[4]/form/div/div/textarea').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Hello, this is a test of the text to speech endpoint.')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div[4]/form/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Validate that the /api/tts endpoint returns a valid audio/mpeg stream and then toggle sound playback in the widget UI.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Attempt to intercept or monitor network requests to /api/tts to confirm response content type and validate audio stream data.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Intercept the /api/tts request to validate response content type and audio stream data
        async with page.expect_response(lambda response: '/api/tts' in response.url) as tts_response_info:
            # Trigger the TTS request by clicking the send button after filling text
            frame = context.pages[-1]
            send_button = frame.locator('xpath=html/body/div/div/div/div[4]/form/div/button').nth(0)
            await send_button.click(timeout=5000)
        tts_response = await tts_response_info.value
        assert tts_response.status == 200, f"Expected status 200 but got {tts_response.status}"
        content_type = tts_response.headers.get('content-type', '')
        assert 'audio/mpeg' in content_type, f"Expected 'audio/mpeg' in content-type but got {content_type}"
        audio_data = await tts_response.body()
        assert len(audio_data) > 1000, "Audio stream data is too short, might be invalid"
        # Toggle sound playback in the widget UI and verify no errors occur
        frame = context.pages[-1]
        toggle_button = frame.locator('xpath=html/body/div/div/div/div[2]/div/div/button').nth(0)
        await toggle_button.click(timeout=5000)  # Toggle sound off
        await page.wait_for_timeout(1000)
        await toggle_button.click(timeout=5000)  # Toggle sound on
        await page.wait_for_timeout(1000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    