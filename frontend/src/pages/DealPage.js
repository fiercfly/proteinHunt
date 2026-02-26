import React from 'react';
import { useParams } from 'react-router-dom';
import DealDetail from '../components/deals/DealDetail';

export default function DealPage() {
  const { id } = useParams();
  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 52 }}>
      <DealDetail id={id} />
    </div>
  );
}