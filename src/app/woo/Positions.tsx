'use client';

import { Position } from '@/types';
import { IconList, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { IconLayoutList } from '@tabler/icons-react';
import { useState } from 'react';
import ClosedPositionCard from './ClosedPositionCard';
import PositionCard from './PositionCard';

interface Props {
  positions: Position[];
}

export default function Positions({ positions }: Props) {
  const [showDetail, setShowDetail] = useState(false);
  const [sortAscending, setSortAscending] = useState(true);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="flex w-full items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span>Positions</span>
          <button onClick={() => setSortAscending(!sortAscending)}>
            {sortAscending ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />}
          </button>
        </div>
        <div>
          <button onClick={() => setShowDetail(!showDetail)}>
            {showDetail ? <IconList size={16} /> : <IconLayoutList size={16} />}
          </button>
        </div>
      </h2>
      <div className="flex flex-col gap-2">
        {positions
          .filter((position) => position.unrealized_pnl !== 0 && position.quantity !== 0)
          .sort((a, b) =>
            sortAscending
              ? a.unrealized_pnl - b.unrealized_pnl
              : b.unrealized_pnl - a.unrealized_pnl,
          )
          .map((position) => (
            <PositionCard
              position={position}
              showDetail={showDetail}
              key={`${position.symbol}-${position.position_side}`}
            />
          ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {positions
          .filter((position) => position.pnl !== 0)
          .sort((a, b) => (sortAscending ? a.pnl - b.pnl : b.pnl - a.pnl))
          .map((position) => (
            <ClosedPositionCard
              position={position}
              key={`${position.symbol}-${position.position_side}`}
            />
          ))}
      </div>
    </section>
  );
}
