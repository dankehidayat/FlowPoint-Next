import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Webpack configuration for Prisma
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Safe handling of externals
      const externals = config.externals || [];

      if (Array.isArray(externals)) {
        config.externals = [
          ...externals,
          { "@prisma/client": "commonjs @prisma/client" },
        ];
      }
    }

    // Safe handling of module rules
    const rules = config.module?.rules || [];
    config.module = {
      ...config.module,
      rules: [
        ...rules,
        {
          test: /\.node$/,
          use: "node-loader",
        },
      ],
    };

    return config;
  },
};

export default nextConfig;
