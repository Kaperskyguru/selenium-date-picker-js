const express = require("express");
const { By, Builder, Select } = require("selenium-webdriver");

const app = express();
const port = 3002;
let driver;

const URL = "https://jqueryui.com/datepicker/#date-range";
const expected_fr_date = "20";
const expected_to_date = "26";

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/", async (request, response) => {
  try {
    const data = await DatePickerWithLambdaTest();
    response.status(200).json(data);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Server error occurred",
    });
  }
});

async function DatePickerWithLocal() {
  try {
    const driver = await new Builder().forBrowser("chrome").build();
    return selectDatePicker(driver);
  } catch (error) {
    throw error;
  } finally {
    await driver.quit();
  }
}

async function DatePickerWithLambdaTest() {
  const USERNAME = ""; //replace with your username
  const KEY = ""; //replace with your accesskey

  const GRID_HOST = "hub.lambdatest.com/wd/hub";

  const capabilities = {
    browserName: "Chrome",
    browserVersion: "107.0",
    "LT:Options": {
      username: USERNAME,
      accessKey: KEY,
      geoLocation: "US",
      platformName: "Windows 10",
      build: "Date Picker",
      project: "Date Picker Example",
      w3c: true,
      plugin: "node_js-node_js",
    },
  };

  const gridUrl = "https://" + USERNAME + ":" + KEY + "@" + GRID_HOST;
  try {
    driver = await new Builder()
      .usingServer(gridUrl)
      .withCapabilities(capabilities)
      .build();

    return await selectDatePicker(driver);
  } catch (error) {
    throw error;
  } finally {
    await driver.quit();
  }
}

async function selectDatePicker(driver) {
  try {
    if (!driver) return;

    await driver.get(URL);

    /**
     * Switching Frames with iframe
     */

    const frame = await driver.findElement(
      By.xpath("//*[@id='content']/iframe")
    );
    await driver.switchTo().frame(frame);

    /**
     * ################################# Steps for the From Date ############################
     *
     *
     */
    const from_date = await driver.findElement(By.xpath('//*[@id="from"]'));
    await from_date.click();

    const from_month = await driver.findElement(
      By.className("ui-datepicker-month")
    );

    const selected_from_month = new Select(from_month);
    await selected_from_month.selectByVisibleText("Jan");

    const from_day = await driver.findElement(
      By.xpath(
        "//td[not(contains(@class,'ui-datepicker-month'))]/a[text()='" +
          expected_fr_date +
          "']"
      )
    );
    await from_day.click();

    /**
     *   ################################# Steps for the To Date ############################
     *   The same steps like the ones in From Month are repeated except that now the operations
     *   are performed on a different web element.
     */
    const to_date = await driver.findElement(By.xpath("//input[@id='to']"));
    await to_date.click();

    const to_month = await driver.findElement(
      By.xpath("//div/select[@class='ui-datepicker-month']")
    );

    const selected_to_month = new Select(to_month);
    await selected_to_month.selectByVisibleText("Feb");

    const to_day = await driver.findElement(
      By.xpath(
        "//td[not(contains(@class,'ui-datepicker-month'))]/a[text()='" +
          expected_to_date +
          "']"
      )
    );
    await to_day.click();

    /**
     * Get Date values
     */
    const selected_from_date_str = await from_date.getAttribute("value");
    const selected_to_date_str = await to_date.getAttribute("value");

    return {
      from: selected_from_date_str,
      to: selected_to_date_str,
    };
  } catch (error) {
    throw error;
  }
}
