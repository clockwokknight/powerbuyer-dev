import { createRouter, createWebHistory } from "vue-router";
//App Pages
const Dashboard = () => import("@/views/Dashboard.vue");
import Login from "@/views/Login.vue";
const Auctions = () => import("@/views/Auctions.vue");
const Auction = () => import("@/views/Auction.vue");
const AuctionHome = () => import("@/components/auction/AuctionHome.vue");
const Buyers = () => import("@/views/Buyers.vue");
const Buyer = () => import("@/views/Buyer.vue");
import Lenders from "@/views/Lenders.vue";
import Lender from "@/views/Lender.vue";
import Inventory from "@/views/Inventory.vue";
import Vehicle from "@/views/Vehicle.vue";
const Vendors = () => import("@/views/Vendors.vue");
const Vendor = () => import("@/views/Vendor.vue");
const VendorHome = () => import("@/components/vendor/VendorHome.vue");
const Dealers = () => import("@/views/Dealers.vue");
const Dealer = () => import("@/views/Dealer.vue");
const DealerHome = () => import("@/components/dealer/DealerHome.vue");
import Lanes from "@/views/Lanes.vue";
import LanesHistory from "@/views/LanesHistory.vue";
import LanesManage from "@/views/LanesManage.vue";
import Deals from "@/views/Deals.vue";
import Deal from "@/views/Deal.vue";
import OtherSystemMenus from "@/views/OtherSystemMenus.vue";
import BuyerHome from "@/components/buyer/BuyerHome.vue";
const NotFound = () => import("@/views/NotFound.vue");
import Components from "@/views/Components.vue";

export const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/",
      name: "Dashboard",
      component: Dashboard,
    },
    {
      path: "/components",
      name: "Components",
      component: Components,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/auctions",
      name: "Auctions",
      component: Auctions,
      children: [
        {
          path: "",
          name: "AuctionHome",
          component: AuctionHome,
        },
        {
          path: ":id",
          name: "SingleAuction",
          component: Auction,
        },
      ],
    },
    {
      path: "/buyers",
      name: "Buyers",
      component: Buyers,
      children: [
        {
          path: "",
          name: "BuyerHome",
          component: BuyerHome,
        },
        {
          path: ":id",
          name: "SingleBuyer",
          component: Buyer,
        },
      ],
    },
    {
      path: "/lenders",
      name: "Lenders",
      component: Lenders,
    },
    {
      path: "/lender",
      name: "Lender",
      component: Lender,
    },
    {
      path: "/inventory",
      name: "Inventory",
      component: Inventory,
    },
    {
      path: "/vendors",
      name: "Vendors",
      component: Vendors,
      children: [
        {
          path: "",
          name: "VendorHome",
          component: VendorHome,
        },
        {
          path: ":id",
          name: "SingleVendor",
          component: Vendor,
        },
      ],
    },
    {
      path: "/dealers",
      name: "Dealers",
      component: Dealers,
      children: [
        {
          path: "",
          name: "DealerHome",
          components: DealerHome,
        },
        {
          path: ":id",
          name: "SingleDealer",
          component: Dealer,
        },
      ],
    },
    {
      path: "/lanes",
      name: "Lanes",
      component: Lanes,
    },
    {
      path: "/lanes-history",
      name: "Lanes history",
      component: LanesHistory,
    },
    {
      path: "/lanes-manage",
      name: "Lanes Manage",
      component: LanesManage,
    },
    {
      path: "/deals",
      name: "Deals",
      component: Deals,
    },
    {
      path: "/deal",
      name: "Deal",
      component: Deal,
    },
    {
      path: "/vehicle",
      name: "Vehicle",
      component: Vehicle,
    },
    {
      path: "/system",
      name: "System",
      component: OtherSystemMenus,
    },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
  ],
});

router.beforeEach(async (to, from, next) => {
  const loading = window["$loading"] || null;
  loading && loading.start();
  next();
  loading && loading.finish();
});

router.afterEach(() => {
  const loading = window["$loading"] || null;
  loading && loading.finish();
});
