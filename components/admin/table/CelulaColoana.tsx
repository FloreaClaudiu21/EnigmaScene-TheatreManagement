import React from "react";

export default function CelulaColoana({
  date,
  clasa,
}: {
  date: any;
  clasa?: any;
}) {
  return (
    <div
      className={
        `flex flex-row items-center gap-1 justify-center text-center h-full break-all ` &&
        clasa
      }
    >
      {date}
    </div>
  );
}
