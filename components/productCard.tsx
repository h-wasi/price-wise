import { Product } from "@/lib/types/index.types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product._id}`}>
      <div className="product-card_img-container">
        <Image
          src={product.image}
          width={200}
          height={200}
          alt="product.title"
          className="product-card_img"
        ></Image>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="product-title">{product.title}</h3>
        <div className="flex justify-between">
          <p className="text-black opacity-50 text-lg capitalize">
            {product.category}
          </p>
          <p className="text-black text-lg font-semibold">
            <span>{product?.currency}</span>
            <span>{product.currentPrice}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
