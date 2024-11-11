/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pixabay.com'//アップロードしたい画像のホスト名にする
      },
      {
        protocol: 'https',
        hostname: 'tjhooopggjnjqmiohimd.supabase.co', // Supabaseのホストも追加
      },
    ]
  },
};

export default nextConfig;
