// tests/admin_add_book.test.js

const { Builder, By, until, Key } = require("selenium-webdriver");
const assert = require("assert");

describe("Admin Add Book UI Test", function () {
  this.timeout(60000); // Increase timeout to 60s
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    await driver.quit();
  });

  it("should allow admin to add a new book", async () => {
    // 1️⃣ Go to login page
    await driver.get("http://localhost:5173/login");

    // 2️⃣ Admin login
    await driver.findElement(By.css("input[type='email']")).sendKeys("admin@booknet.com");
    await driver.findElement(By.css("input[type='password']")).sendKeys("12345");
    await driver.findElement(By.css("button.login-button")).click();

    // Wait for redirect to home page
    await driver.wait(until.urlContains("/home"), 5000);

    // 3️⃣ Navigate to Admin page
    await driver.get("http://localhost:5173/admin");

    // Wait until the Selling Books tab form is loaded
    await driver.wait(until.elementLocated(By.css("form")), 5000);

    // 4️⃣ Fill add book form
    await driver.findElement(By.css("input[placeholder='Book Title']")).sendKeys("Selenium Test Book");
    await driver.findElement(By.css("input[placeholder='Author']")).sendKeys("Test Author");
    await driver.findElement(By.css("input[placeholder='Price']")).sendKeys("250");
    await driver.findElement(By.css("input[placeholder='Image URL']")).sendKeys("https://via.placeholder.com/150");

    // Select category
    const categorySelect = await driver.findElement(By.css("select"));
    await categorySelect.sendKeys("kids");

    // 5️⃣ Submit the form
    const addButton = await driver.findElement(By.css("button[type='submit']"));
    await addButton.click();

    // 6️⃣ Handle alert popup (Selling Book added!)
    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    await alert.accept(); // Click OK

    // 7️⃣ Wait for book to appear in the list
    const addedBookElement = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Selenium Test Book')]")),
      5000
    );

    const addedBookText = await addedBookElement.getText();

    // 8️⃣ Assertion: check that title is present (ignore category and price)
    assert.ok(addedBookText.includes("Selenium Test Book"));
  });
});



