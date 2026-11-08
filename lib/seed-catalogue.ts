// Starter catalogue used only by the admin "Sync Categories" button
// (app/api/admin/seed-products). The shop and search read the database.

export type Product = {
  id: string;
  name: string;
  image: string;
  priceMin: number;
  priceMax: number;
};

export type Category = {
  name: string;
  products: Product[];
};

let counter = 0;
function nextImage() {
  counter += 1;
  return `/products/prod${counter}.jpg`;
}

export const CATEGORIES: Category[] = [
  {
    name: "Laptops & Computers",
    products: [
      {
        id: "macbook-air-m3",
        name: "Apple MacBook Air M3",
        image: nextImage(),
        priceMin: 1990000,
        priceMax: 2400000,
      },
      {
        id: "hp-spectre-x360",
        name: "HP Spectre x360",
        image: nextImage(),
        priceMin: 2500000,
        priceMax: 2850000,
      },
      {
        id: "asus-rog-zephyrus-g14",
        name: "ASUS ROG Zephyrus G14",
        image: nextImage(),
        priceMin: 2100000,
        priceMax: 2600000,
      },
      {
        id: "lenovo-thinkpad-x1-carbon",
        name: "Lenovo ThinkPad X1 Carbon",
        image: nextImage(),
        priceMin: 2300000,
        priceMax: 2750000,
      },
      {
        id: "dell-xps-13-touch",
        name: "Dell XPS 13 Touch",
        image: nextImage(),
        priceMin: 1850000,
        priceMax: 2200000,
      },
    ],
  },
  {
    name: "Smartphones & Tablets",
    products: [
      {
        id: "iphone-15-pro",
        name: "Apple iPhone 15 Pro",
        image: nextImage(),
        priceMin: 1040000,
        priceMax: 1300000,
      },
      {
        id: "galaxy-s24-ultra",
        name: "Samsung Galaxy S24 Ultra",
        image: nextImage(),
        priceMin: 1100000,
        priceMax: 1250000,
      },
      {
        id: "pixel-8-pro",
        name: "Google Pixel 8 Pro",
        image: nextImage(),
        priceMin: 850000,
        priceMax: 1050000,
      },
      {
        id: "ipad-air-m2",
        name: "Apple iPad Air M2",
        image: nextImage(),
        priceMin: 950000,
        priceMax: 1150000,
      },
      {
        id: "oneplus-12",
        name: "OnePlus 12",
        image: nextImage(),
        priceMin: 780000,
        priceMax: 920000,
      },
    ],
  },
  {
    name: "Audio & Sound",
    products: [
      {
        id: "sony-wh-1000xm5",
        name: "Sony WH-1000XM5 Headphones",
        image: nextImage(),
        priceMin: 450000,
        priceMax: 550000,
      },
      {
        id: "airpods-pro-2",
        name: "Apple AirPods Pro (2nd Gen)",
        image: nextImage(),
        priceMin: 240000,
        priceMax: 290000,
      },
      {
        id: "jbl-flip-6",
        name: "JBL Flip 6 Bluetooth Speaker",
        image: nextImage(),
        priceMin: 130000,
        priceMax: 165000,
      },
      {
        id: "bose-qc-ultra",
        name: "Bose QuietComfort Ultra",
        image: nextImage(),
        priceMin: 520000,
        priceMax: 630000,
      },
      {
        id: "anker-soundcore-space-a40",
        name: "Anker Soundcore Space A40",
        image: nextImage(),
        priceMin: 95000,
        priceMax: 120000,
      },
    ],
  },
  {
    name: "Wearables & Smartwatches",
    products: [
      {
        id: "apple-watch-series-9",
        name: "Apple Watch Series 9",
        image: nextImage(),
        priceMin: 480000,
        priceMax: 580000,
      },
      {
        id: "galaxy-watch-6",
        name: "Samsung Galaxy Watch 6",
        image: nextImage(),
        priceMin: 210000,
        priceMax: 260000,
      },
      {
        id: "fitbit-charge-6",
        name: "Fitbit Charge 6",
        image: nextImage(),
        priceMin: 180000,
        priceMax: 220000,
      },
      {
        id: "garmin-venu-3",
        name: "Garmin Venu 3",
        image: nextImage(),
        priceMin: 550000,
        priceMax: 650000,
      },
      {
        id: "pixel-watch-2",
        name: "Google Pixel Watch 2",
        image: nextImage(),
        priceMin: 380000,
        priceMax: 440000,
      },
    ],
  },
  {
    name: "Smart Home Devices",
    products: [
      {
        id: "echo-dot-5",
        name: "Amazon Echo Dot (5th Gen)",
        image: nextImage(),
        priceMin: 65000,
        priceMax: 85000,
      },
      {
        id: "nest-hub-2",
        name: "Google Nest Hub (2nd Gen)",
        image: nextImage(),
        priceMin: 120000,
        priceMax: 150000,
      },
      {
        id: "philips-hue-starter",
        name: "Philips Hue Starter Kit",
        image: nextImage(),
        priceMin: 195000,
        priceMax: 240000,
      },
      {
        id: "ring-doorbell-pro-2",
        name: "Ring Video Doorbell Pro 2",
        image: nextImage(),
        priceMin: 260000,
        priceMax: 320000,
      },
      {
        id: "tp-link-kasa-plug",
        name: "TP-Link Kasa Smart Plug",
        image: nextImage(),
        priceMin: 25000,
        priceMax: 35000,
      },
    ],
  },
  {
    name: "Gaming & Entertainment",
    products: [
      {
        id: "ps5-slim",
        name: "Sony PlayStation 5 Slim",
        image: nextImage(),
        priceMin: 680000,
        priceMax: 750000,
      },
      {
        id: "switch-oled",
        name: "Nintendo Switch OLED",
        image: nextImage(),
        priceMin: 420000,
        priceMax: 480000,
      },
      {
        id: "rog-ally",
        name: "ASUS ROG Ally",
        image: nextImage(),
        priceMin: 850000,
        priceMax: 980000,
      },
      {
        id: "meta-quest-3",
        name: "Meta Quest 3 VR Headset",
        image: nextImage(),
        priceMin: 750000,
        priceMax: 890000,
      },
      {
        id: "logitech-g502-x",
        name: "Logitech G502 X Gaming Mouse",
        image: nextImage(),
        priceMin: 110000,
        priceMax: 140000,
      },
    ],
  },
  {
    name: "Cameras & Action Gear",
    products: [
      { id: "sony-alpha-7-iv", name: "Sony Alpha 7 IV", image: nextImage(), priceMin: 2800000, priceMax: 3200000 },
      { id: "canon-eos-r5", name: "Canon EOS R5", image: nextImage(), priceMin: 4100000, priceMax: 4600000 },
      { id: "fujifilm-x-t5", name: "Fujifilm X-T5", image: nextImage(), priceMin: 2200000, priceMax: 2500000 },
      { id: "dji-osmo-pocket-3", name: "DJI Osmo Pocket 3", image: nextImage(), priceMin: 850000, priceMax: 980000 },
      { id: "gopro-hero12", name: "GoPro HERO12 Black", image: nextImage(), priceMin: 520000, priceMax: 590000 },
    ],
  },
  {
    name: "Lights",
    products: [
      { id: "ring-light-tripod", name: "Ring Light with Tripod Stand", image: nextImage(), priceMin: 45000, priceMax: 75000 },
      { id: "neewer-softbox-kit", name: "Neewer Bi-Color LED Softbox Kit", image: nextImage(), priceMin: 220000, priceMax: 340000 },
      { id: "mushroom-table-lamp", name: "Minimalist Mushroom Table Lamp", image: nextImage(), priceMin: 35000, priceMax: 55000 },
    ],
  },
];

