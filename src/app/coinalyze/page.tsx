// import CoinalyzeService from "@/service/coinalyze";
// import WooService from "@/service/woo";

// const coinalyzeService = new CoinalyzeService();

export default async function Page(): Promise<JSX.Element> {
  return <div>Coinalyze</div>;
//   const exchanges = await coinalyzeService.getExchanges();
  // const markets = await coinalyzeService.getFutureMarkets();
  // const btcMarketSymbols = markets
  //   .filter(
  //     (m) =>
  //       m.base_asset.includes("BTC") && ["6", "3", "A"].includes(m.exchange)
  //   )
  //   .map((m) => m.symbol);
  // const btcOpenInterest = await coinalyzeService.getOpenInterest(
  //   btcMarketSymbols
  // );
  // console.log(btcOpenInterest);
  // return (
  //   <div>
  //     <h1>Coinalyze</h1>
  //   </div>
  // );
}
