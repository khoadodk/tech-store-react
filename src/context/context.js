import React, { Component } from 'react';
import { linkData } from './linkData';
import { socialData } from './socialData';
import { items } from './productData';

const ProductContext = React.createContext();

class ProductProvider extends Component {
    state = {
        sidebarOpen: false,
        cartOpen: false,
        cartItems: 0,
        links: linkData,
        socialLinks: socialData,
        cart: [],
        cartTax: 0,
        cartTotal: 0,
        cartSubtotal: 0,
        storeProducts: [],
        featuredProducts: [],
        singleProduct: {},
        loading: true,
        //Filter products
        filteredProducts: [],
        search: "",
        price: 0,
        min: 0,
        max: 0,
        company: "all",
        shipping: false
    };

    componentDidMount() {
        this.setProducts(items);
    };
    
    setProducts = products => {
        let storeProducts = products.map(item => {
            const { id } = item.sys;
            const image = item.fields.image.fields.file.url
            const product = { id, ...item.fields, image };
            return product;
        })
        // Get featured products
        let featuredProducts = storeProducts.filter(item => item.featured === true);
        // Get max price
        let maxPrice = Math.max(...storeProducts.map(item => item.price))
        this.setState({
            storeProducts,           
            featuredProducts,
            cart: this.getStorageCart(),
            singleProduct: this.getStorageProduct(),
            loading: false,
            //Filter products
            filteredProducts: storeProducts,
            price: maxPrice,
            max: maxPrice
        }, () => {
            this.addTotals();
        })
    };
    //get Cart from local storage
    getStorageCart = () => {
        let cart;
        if(localStorage.getItem("cart")) {
            cart = JSON.parse(localStorage.getItem("cart"));
        } else {
            cart = [];
        }
        return cart;
    }
    //get product from local storage
    getStorageProduct = () => {
        return localStorage.getItem("singleProduct") 
            ? JSON.parse(localStorage.getItem("singleProduct"))
            : {};
    }
    //get totals
    getTotals = () => {
        let subTotal = 0;
        let cartItems = 0;
        this.state.cart.forEach(item => {
            subTotal += item.total;
            cartItems += item.count;
        });
        subTotal = parseFloat(subTotal.toFixed(2));
        let tax = subTotal * 0.2;
        tax = parseFloat(tax.toFixed(2));
        let total = subTotal + tax;
        total = parseFloat(total.toFixed(2));
        return {
            cartItems,
            subTotal,
            tax,
            total
        }
    }
    // add totals
    addTotals = () => {
        const totals = this.getTotals();
        this.setState({
            cartItems: totals.cartItems,
            cartSubtotal: totals.subTotal,
            cartTax: totals.tax,
            cartTotal: totals.total
        })
    }
    //sync storage
    syncStorage = () => {
        localStorage.setItem("cart", JSON.stringify(this.state.cart));
    }
    //add to cart
    addToCart = (id) => {
        let existingCart = [...this.state.cart];
        let existingProducts = [...this.state.storeProducts];
        let existingItem = existingCart.find(item => item.id === id);
        //if item is not in the cart, add count and total to cart
        if(!existingItem) {
            existingItem = existingProducts.find(item => item.id === id);
            let total = existingItem.price;
            let cartItem = { ...existingItem, count: 1, total };
            existingCart = [ ...existingCart, cartItem]
        } else {
            existingItem.count++;
            existingItem.total = existingItem.price * existingItem.count;
            existingItem.total = parseFloat(existingItem.total.toFixed(2));
        }
        this.setState(
            () => {
                return { cart: existingCart };
            },
            () => {
                this.addTotals();
                this.syncStorage();
                this.openCart();
            }
        )
    }
    //set single product
    setSingleProduct = (id) => {
        let product = this.state.storeProducts.find(item => item.id === id)
        localStorage.setItem("singleProduct", JSON.stringify(product));
        this.setState({
            singleProduct: {...product},
            loading: false
        })
    }

    handleSidebar = () => this.setState({sidebarOpen: !this.state.sidebarOpen});

    handleCart = () => this.setState({cartOpen: !this.state.cartOpen});

    closeCart = () => this.setState({cartOpen: false});

    openCart = () => this.setState({cartOpen: true});

    //Cart functionality
    increment = id => {
        let tempCart = [...this.state.cart];
        const cartItem = tempCart.find(item => item.id === id);
        cartItem.count++;
        cartItem.total = cartItem.count * cartItem.price;
        cartItem.total = parseFloat(cartItem.total.toFixed(2));
        this.setState({
            cart: [...tempCart]
        }, () => {
            this.addTotals();
            this.syncStorage()
        })
    }
    decrement = id => {
        let tempCart = [...this.state.cart];
        const cartItem = tempCart.find(item => item.id === id);
        if(cartItem.count === 0){
            this.removeItem(id)
        } else {
            cartItem.count--;
            cartItem.total = cartItem.count * cartItem.price;
            cartItem.total = parseFloat(cartItem.total.toFixed(2));
            this.setState({
                cart: [...tempCart]
            }, () => {
                this.addTotals();
                this.syncStorage()
            })
        }
    }
    removeItem = id => {
        let tempCart = [...this.state.cart];
        tempCart = tempCart.filter(item => item.id !== id);
        this.setState({
            cart: [...tempCart]
        },() => {
            this.addTotals();
            this.syncStorage()
        })
    }
    clearCart = () => {
        this.setState({
            cart: []
        }, () => {
            this.addTotals();
            this.syncStorage()
        })
    }

    // Hanlde filetering
    handleChange = e => {
        const name = e.target.name;
        const value = e.target.type === "checkbox" 
            ? e.target.checked
            : e.target.value;
        this.setState({
            [name]: value
        }, this.sortData)
    }
    sortData = () => {
        const { search, company, price, shipping, storeProducts } = this.state;
        let tempProducts = [...storeProducts];
        // Filtering based on company
        if(company !== "all") {
            tempProducts = tempProducts.filter(item => item.company === company)
        }
        // Filtering based on price
        let tempPrice = parseInt(price);
        tempProducts = tempProducts.filter(item => item.price <= tempPrice)
        // Filtering based on shipping
        if(shipping) tempProducts = tempProducts.filter(item => item.freeShipping === true)
        //Filtering based on search
        if(search.length > 0) {
            tempProducts = tempProducts.filter(item => {
                let tempSearch = search.toLowerCase();
                let tempTitle = item.title.toLowerCase().slice(0, search.length);
                if(tempSearch === tempTitle) {
                    return item;
                }
            })
        }

        this.setState({ filteredProducts: tempProducts })
    }

    render() {
        return (
            <ProductContext.Provider 
                value={{
                    ...this.state,
                    handleSidebar: this.handleSidebar,
                    handleCart: this.handleCart,
                    closeCart: this.closeCart,
                    openCart: this.openCart,
                    addToCart: this.addToCart,
                    setSingleProduct: this.setSingleProduct,
                    //Cart functionality
                    increment: this.increment,
                    decrement: this.decrement,
                    removeItem: this.removeItem,
                    clearCart: this.clearCart,
                    //Filter products
                    handleChange: this.handleChange
                }}
            >
                {this.props.children}
            </ProductContext.Provider>
        )
    }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };