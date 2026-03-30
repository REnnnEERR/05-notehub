import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactPaginateFix = (ReactPaginate as unknown as { default?: any }).default || ReactPaginate;

export const Pagination = ({ pageCount, onPageChange }: PaginationProps) => {
  return (
    <ReactPaginateFix
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={onPageChange}
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageClassName={css.pageItem}
      previousClassName={css.pageItem}
      nextClassName={css.pageItem}
      breakClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      previousLinkClassName={css.pageLink}
      nextLinkClassName={css.pageLink}
      breakLinkClassName={css.pageLink}
    />
  );
};