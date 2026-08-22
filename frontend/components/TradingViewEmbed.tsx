"use client";

interface Props {
  symbol: string;
  height?: number;
}

export function TradingViewEmbed({ symbol, height = 550 }: Props) {
  const sym = symbol.toUpperCase().trim();
  // Clean TradingView widget iframe URL with dark theme
  const embedUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=NSE%3A${encodeURIComponent(
    sym
  )}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Asia%2FKolkata&withdateranges=1&showpopupbutton=1&popup_width=1000&popup_height=650&locale=en#%7B%22page-uri%22%3A%22localhost%22%7D`;

  return (
    <div
      style={{
        position: "relative",
        background: "#040610",
        border: "1px solid var(--border-glow)",
        width: "100%",
        height,
      }}
    >
      <iframe
        id="tradingview_widget"
        src={embedUrl}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          background: "#040610",
        }}
        allowFullScreen
      />
    </div>
  );
}
