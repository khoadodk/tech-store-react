import React from 'react';
import styled from 'styled-components';
import { ProductConsumer } from '../../context';

export default function ProductFilter() {
    return (
        <ProductConsumer>
            {value => {
                const {
                    search,
                    min,
                    max,
                    company,
                    price,
                    shipping,
                    handleChange,
                    storeProducts
                } = value;
                let companies = storeProducts.map(item => item.company).filter((value, index, self) => self.indexOf(value) === index)
                companies.push("all");
                return (
                    <div className="row my-5">
                        <div className="col-10 max-auto">
                            <FilterWrapper>
                                {/* text search */}
                                <div>
                                    <label htmlFor="search">search products</label>
                                    <input 
                                        type="text"
                                        name="search"
                                        id="search"
                                        onChange={handleChange}
                                        value={search}
                                        className="filter-item"
                                    />
                                </div>
                                {/* category search */}
                                <div>
                                    <label htmlFor="company">company</label>
                                    <select 
                                        name="company"
                                        id="company"
                                        onChange={handleChange}
                                        value={company}
                                        className="filter-item"
                                    >
                                        {companies.map((company, index) => {
                                            return (
                                                <option key={index} value={company}>
                                                    {company}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                                {/* price range */}
                                <div>
                                    <label htmlFor="price">
                                        <div className="mb-2">
                                            product price: <span>$ {price}</span>
                                        </div>
                                    </label>
                                    <input 
                                        type="range"
                                        name="price"
                                        id="price"
                                        min={min}
                                        max={max}
                                        onChange={handleChange}
                                        value={price}
                                        className="filter-price"
                                    />
                                </div>
                                {/* free shiping */}
                                <div>
                                    <label htmlFor="free shipping" className="mx-2">
                                        free shipping
                                    </label>
                                    <input 
                                        type="checkbox"
                                        name="shipping"
                                        id="shipping"
                                        onChange={handleChange}
                                        checked={shipping && true}
                                    />
                                </div>
                            </FilterWrapper>
                        </div>
                    </div>
                )
            }}
        </ProductConsumer>
    )
}

const FilterWrapper = styled.div`
    display:grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-column-gap: 2rem;
    grid-row-gap: 1rem;
    label {
        font-weight: bold;
        text-transform: capitalize;
    }
    .filter-item, .filter-price {
        display: block;
        width: 100%;
        background: transparent;
        border-radius: transparent;
        border-radius: 0.5rem;
        border: 2px solid var(--darkGrey);
    }
`