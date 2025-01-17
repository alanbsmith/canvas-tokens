import * as React from 'react';
import './index.css';

export interface TokenGridProps<T> {
  headings: React.ReactNode[];
  rows: T[];
  children: (row: T) => React.ReactNode;
  caption?: React.ReactNode;
}

function classNames(baseClassName: string, classNames = '') {
  return classNames.length ? `${baseClassName} ${classNames}` : baseClassName;
}

export function TokenGrid<T>({caption, children, headings, rows}: TokenGridProps<T>) {
  return (
    <table className="token-grid">
      {caption && (
        <caption className="token-grid__caption cnvs-sys-type-subtext-large">{caption}</caption>
      )}
      <thead className="token-grid__head">
        <tr className="token-grid__row">
          {headings.map((heading, index) => (
            <th key={index} className="token-grid__head-item cnvs-sys-type-subtext-large">
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="token-grid__body">
        {rows.map((row, index) => (
          <tr key={index} className="token-grid__row">
            {children(row)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const TokenGridRowItem: React.FC<React.HTMLProps<HTMLTableCellElement>> = ({
  className,
  ...props
}) => (
  <td
    className={classNames('token-grid__row-item cnvs-sys-type-subtext-large', className)}
    {...props}
  />
);

const TokenGridSample: React.FC<React.HTMLProps<HTMLSpanElement>> = ({className, ...props}) => (
  <span className={classNames('token-grid__sample', className)} {...props} />
);

const TokenGridSwatch: React.FC<React.HTMLProps<HTMLSpanElement>> = ({className, ...props}) => (
  <span className={classNames('token-grid__swatch', className)} {...props} />
);

const TokenGridMonospaceLabel: React.FC<React.HTMLProps<HTMLSpanElement>> = ({
  className,
  ...props
}) => (
  <span
    className={classNames('token-grid__monospace-label cnvs-sys-type-subtext-medium', className)}
    {...props}
  />
);

TokenGrid.RowItem = TokenGridRowItem;
TokenGrid.Sample = TokenGridSample;
TokenGrid.Swatch = TokenGridSwatch;
TokenGrid.MonospaceLabel = TokenGridMonospaceLabel;
