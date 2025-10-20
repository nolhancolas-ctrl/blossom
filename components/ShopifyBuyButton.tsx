
"use client";
import { useEffect, useRef } from "react";

/**
 * Intègre un Buy Button Shopify sans dépendre du thème Shopify.
 * Crée d’abord un canal de vente "Buy Button" dans Shopify pour récupérer le script et l'ID produit.
 */
export default function ShopifyBuyButton({
  productId,
  domain,
  storefrontToken
}: {
  productId: string; // ex: "gid://shopify/Product/1234567890"
  domain: string; // ex: "ta-boutique.myshopify.com"
  storefrontToken: string; // token pour l’SDK BuyButton/Storefront
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = "shopify-buy-button-sdk";
    const existing = document.getElementById(scriptId);

    function init() {
      const anyWindow = window as any;
      if (!anyWindow.ShopifyBuy) return;
      const client = anyWindow.ShopifyBuy.buildClient({ domain, storefrontAccessToken: storefrontToken });
      anyWindow.ShopifyBuy.UI.onReady(client).then((ui: any) => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = "";
        ui.createComponent("product", {
          id: productId,
          node: containerRef.current,
          moneyFormat: "%E2%82%AC%7B%7Bamount_no_decimals%7D%7D",
          options: { product: { buttonDestination: "checkout" } }
        });
      });
    }

    function load() {
      if (existing) { init(); return; }
      const s = document.createElement("script");
      s.id = scriptId;
      s.async = true;
      s.src = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
      s.onload = init;
      document.body.appendChild(s);
    }

    load();
  }, [productId, domain, storefrontToken]);

  return <div ref={containerRef} className="w-full" />;
}
