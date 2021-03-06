import GlobalStyles from "./Components/Styles/Global";
import Header from "./Components/Header";
import Menu from "./Components/Menu";
import ShoppingCart from "./Components/ShoppingCart";
import Favourites from "./Components/Favourites";
import ScrollToTop from "./Components/ScrollToTop";
import { useState, useEffect } from "react";

// Using local storage for the cart items
const cartFromLocalStorage = JSON.parse(localStorage.getItem("cart") || "[]");
// Using local storage for the favourites items
const favouritesFromLocalStorage = JSON.parse(
  localStorage.getItem("favourites") || "[]"
);

function App() {
  // Setting up the menu items array
  const [menu, setMenu] = useState(
    // Items
    [],
    []
  );
  // Setting up the cart items array
  const [cartMenu, setCartMenu] = useState(cartFromLocalStorage);
  // Setting up the favourites items array
  const [favouritesMenu, setFavouritesMenu] = useState(
    favouritesFromLocalStorage
  );
  // Setting up the on scroll animation of the header
  const [headerBackground, setHeaderBackground] = useState(false);
  const [scrollToTopBtn, setScrollToTopBtn] = useState(false);
  // Setting up the toggle between diff pages
  const [toggleState, setToggleState] = useState(1);

  // Using local storage for the cart items
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartMenu));
  }, [cartMenu]);

  // Using local storage for the favourites items
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favouritesMenu));
  }, [favouritesMenu]);

  useEffect(() => {
    const getMenu = async () => {
      const menuFromServer = await fetchMenu();
      setMenu(menuFromServer);
    };

    getMenu();
  }, []);

  // Fetch Menu
  const fetchMenu = async () => {
    const res = await fetch("http://localhost:5000/menu");
    const data = await res.json();

    return data;
  };

  // Add To Cart
  const addToCart = async (id) => {
    // const res = await fetch(`http://localhost:5000/menu/${id}`, {
    //   method: "POST",
    //   headers: {
    //     "Content-type": "application/json",
    //   },
    //   body: JSON.stringify(id),
    // });
    // const data = await res;
    // setCartMenu([...cartMenu, data]);

    if (cartMenu.some((item) => item.id === id)) {
      alert("This item is already in your shopping bag!");
    } else {
      // console.log(id);
      const item = menu.find((product) => product.id === id);
      const newCartMenu = { ...item, numberOfUnits: 1 };
      // console.log(newCartItem);
      setCartMenu([...cartMenu, newCartMenu]);
    }
  };

  // Delete From Cart
  const deleteFromCart = async (id) => {
    // await fetch("http://localhost:5000/menu/${id}", {
    //   method: "DELETE",
    // });

    setCartMenu(cartMenu.filter((item) => item.id !== id));
  };

  // Change the number of units in the cart
  const numberOfUnits = (numberOfUnits) => {
    setCartMenu(
      cartMenu.map((item) =>
        numberOfUnits.id === item.id
          ? { numberOfUnits: numberOfUnits + 1 }
          : item
      )
    );
  };

  // Add To Favourites
  const addToFavourites = async (id) => {
    // const res = await fetch("http://localhost:5000/menu", {
    //   method: "POST",
    //   headers: {
    //     "Content-type": "application/json",
    //   },
    //   body: JSON.stringify(id),
    // });

    // const data = await res.json();

    // setMenu([...menu, data]);

    if (favouritesMenu.some((item) => item.id === id)) {
      alert("This item is already in your favourites!");
    } else {
      // console.log(id);
      const item = menu.find((product) => product.id === id);
      const newFavouritesMenu = { ...item, numberOfUnits: 1 };
      // console.log(newFavItem);
      setFavouritesMenu([...favouritesMenu, newFavouritesMenu]);
    }
  };

  // Delete From Favourites
  const deleteFromFavourites = (id) => {
    // await fetch("http://localhost:5000/menu/${id}", {
    //   method: "DELETE",
    // });

    setFavouritesMenu(favouritesMenu.filter((item) => item.id !== id));
  };

  // Toggle between the main menu, the shopping cart and the favourites
  const toggleTab = (index) => {
    setToggleState(index);
  };

  // Toggle Fav
  // const toggleFav = (id) => {
  //   console.log(id);
  //   setMenu(
  //     menu.map((item) => (item.id === id ? { ...item, fav: !item.fav } : item))
  //   );
  // };

  // Header-Background styles on scroll
  const scrollHeader = () => {
    if (window.scrollY >= 15) {
      setHeaderBackground(true);
    } else {
      setHeaderBackground(false);
    }
  };

  window.addEventListener("scroll", scrollHeader);

  // Scroll To Top Btn
  const scollToTopBtn = () => {
    if (window.scrollY >= 40) {
      setScrollToTopBtn(true);
    } else {
      setScrollToTopBtn(false);
    }
  };

  window.addEventListener("scroll", scollToTopBtn);

  // Scroll To Top
  const scollToTop = () => {
    document.documentElement.scrollTop = 0;
  };

  return (
    <>
      <GlobalStyles />
      <Header headerBackground={headerBackground} onToggleTab={toggleTab} />
      {toggleState === 1 && (
        <Menu
          menu={menu}
          onCartAdd={addToCart}
          // onToggleFav={toggleFav}
          onFavouritesAdd={addToFavourites}
        />
      )}
      {toggleState === 3 && (
        <ShoppingCart
          cartMenu={cartMenu}
          onCartDelete={deleteFromCart}
          onNumberOfUnits={numberOfUnits}
          onFavouritesAdd={addToFavourites}
        />
      )}
      {toggleState === 2 && (
        <Favourites
          favouritesMenu={favouritesMenu}
          onFavouritesDelete={deleteFromFavourites}
          onCartAdd={addToCart}
        />
      )}
      <ScrollToTop scrollToTopBtn={scrollToTopBtn} onScollToTop={scollToTop} />
    </>
  );
}

export default App;
