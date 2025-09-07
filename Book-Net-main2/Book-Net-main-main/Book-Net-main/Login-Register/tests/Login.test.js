// tests/login.test.js
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

describe("Login UI Test", function () {
  this.timeout(30000); // 30 sec timeout
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    await driver.quit();
  });

  it("should log in successfully with valid credentials", async () => {
    await driver.get("http://localhost:5173/login");

    // Fill email
    await driver.findElement(By.css("input[type='email']")).sendKeys("admin@booknet.com");
    // Fill password
    await driver.findElement(By.css("input[type='password']")).sendKeys("12345");

    // Click login
    await driver.findElement(By.css("button.login-button")).click();

    // Wait for navigation
    await driver.wait(until.urlContains("/home"), 5000);

    // Assert
    const url = await driver.getCurrentUrl();
    assert.ok(url.includes("/home"), "User should be redirected to home page");
  });
});
