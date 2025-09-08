import { Builder, By, Key, until } from "selenium-webdriver";
import { Given, When, Then, After, Before } from "@cucumber/cucumber";
import { expect } from "chai";

let driver;

Before(async function () {
  driver = await new Builder().forBrowser("chrome").build();
});

After(async function () {
  await driver.quit();
});

Given("I am on the admin page", async function () {
  await driver.get("http://localhost:5173/admin"); // your Vite dev server
});

When("I fill the add book form with valid data", async function () {
  await driver.findElement(By.name("title")).sendKeys("Test Book");
  await driver.findElement(By.name("author")).sendKeys("Author 1");
  await driver.findElement(By.name("price")).sendKeys("500");
  await driver.findElement(By.name("image")).sendKeys("https://via.placeholder.com/150");
  
  // select category dropdown
  const categorySelect = await driver.findElement(By.tagName("select"));
  await categorySelect.sendKeys("kids");
});

When("I submit the book", async function () {
  const submitButton = await driver.findElement(By.css("form button[type='submit']"));
  await submitButton.click();
});







