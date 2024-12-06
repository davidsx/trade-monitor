import type { Time } from 'lightweight-charts';
import { createChart, ColorType, CrosshairMode, LineStyle } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

export type ChartData = { time: Time; value?: number };
export interface ChartProps {
  data?: ChartData[];
  priceLine?: number;
}

export default function PriceChart(props: ChartProps) {
  const { data = [], priceLine } = props;

  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chartContainer = chartContainerRef.current;
    if (!chartContainer) return;

    const chart = createChart(chartContainer, {
      width: chartContainer.clientWidth,
      height: 240,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        attributionLogo: false,
        fontSize: 10,
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },
      crosshair: {
        mode: CrosshairMode.Hidden,
      },
      leftPriceScale: {
        visible: false,
      },
      rightPriceScale: {
        visible: false,
      },
      timeScale: {
        visible: false,
      },
      handleScale: false,
      handleScroll: false,
    });
    chart.timeScale().fitContent();

    const handleResize = (): void => {
      chart.applyOptions({ width: chartContainer.clientWidth });
      chart.timeScale().fitContent();
    };

    const startValue = data[0]?.value;
    const endValue = data[data.length - 1]?.value;
    const lineColor =
      startValue && endValue ? (endValue > startValue ? '#22c55e' : '#ef4444') : '#D9D8DD';
    const newSeries = chart.addAreaSeries({
      priceScaleId: 'left',
      lineColor,
      topColor: lineColor + '80',
      bottomColor: lineColor + '00',
      lineWidth: 2,
      lastValueVisible: false,
      priceLineVisible: false,
    });
    newSeries.setData(data);

    if (priceLine) {
      newSeries.createPriceLine({
        price: priceLine,
        color: '#828282',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: 'entry',
      });
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [data, priceLine]);

  return <div ref={chartContainerRef} />;
}
