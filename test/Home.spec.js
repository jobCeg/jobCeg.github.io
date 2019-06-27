describe('H1', () => {
  beforeAll(async () => {
    await page.goto("http://localhost:7777/")
  })

  it('should display "google" text on page', async () => {
    const html = await page.$eval("#saludo", e => e.innerHTML);
    expect(html).toBe("hola hijos de su puta madre");
  })
})