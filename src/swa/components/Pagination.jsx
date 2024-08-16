import React from "react";

export default function Pagination({ page, total, itemsPerPage, setPage }) {
  const pages = Array(Math.ceil(total / itemsPerPage)).fill(1);

  return (
    <div className="rn-pagination text-center">
      <ul className="page-list">
        {pages.map((_, i) => {
          return (
            <li key={i} className={page === i ? "active" : ""}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setPage(i);
                }}
              >
                {i + 1}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
