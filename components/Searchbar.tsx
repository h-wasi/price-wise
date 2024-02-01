"use client";
import { scrapeAndStoreProduct } from "@/lib/actions";
import { log } from "console";
import { url } from "inspector";
import React, { FormEvent, isValidElement, useState } from "react";

const isValidAmazonProductUrl = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostName = parsedURL.hostname;
    if (
      hostName.includes("amazon.com") ||
      hostName.includes("amazon.") ||
      hostName.endsWith("amazon")
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

function Searchbar() {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const isValidLink = isValidAmazonProductUrl(searchPrompt);
    if (!isValidLink) {
      return alert("Please enter valid Amazon Product URL");
    }
    try {
      setIsLoading(true);
      //scrape product
      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <form
      //   action=""
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-4 mt-12"
    >
      <input
        type="text"
        placeholder="Enter product link"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        className="searchbar-input"
      ></input>
      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchPrompt === ""}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

export default Searchbar;
