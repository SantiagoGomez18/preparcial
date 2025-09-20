import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

nextConfig.images={
  domains:["http://127.0.0.1:8080/api/authors"]
}

export default nextConfig;
