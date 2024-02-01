"use server";
import { extractCurrency, extractDescription, extractPrice } from "../utils";
import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;
  //Bright data proxy config
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const sessionId = (1000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${sessionId}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  //curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_2a278c0f-zone-unblocker:ho671j855zrq -k https://lumtest.com/myip.json

  try {
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $("a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base"),
      $(".a-price.a-text-price")
    );
    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );
    // const category = $(
    //   "#a-page > nav > ul > li.mn-item--first.mn-item.js-item-with-flyout > div.mn-item__link-container > a.a-size-base-plus.a-color-base.a-link-normal.mn-item--first__sub-link.mn-item__link.mn-link > span"
    // );
    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";
    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";
    const imageUrls = Object.keys(JSON.parse(images));
    const currency = extractCurrency($(".a-price-symbol"));
    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

    const description = extractDescription($);
    // Construct data object with scraped information
    const data = {
      url,
      currency: currency || "$",
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
      image: imageUrls[0],
      imageUrls,
      priceHistory: [],
      discountRate: Number(discountRate),
      category: "category",
      reviewsCount: 100,
      stars: 4.5,
      isOutOfStock: outOfStock,
      description,
    };

    return data;
  } catch (error: any) {
    throw new error(`Failed to scrape product: ${error.message}`);
  }
}
