import React from 'react';
import Cart from '../components/CartPage/Cart';
import cartBcg from '../images/storeBcg.jpeg';
import Hero from '../components/Hero';

export default function CartPage() {
    return (
        <>
            <Hero img={cartBcg} />
            <Cart />
        </>
    )
}