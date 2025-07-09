
const links = {
  client: {
    home: "/",
    auth: "/auth",
    product: "/product/:id", // اینجا!
  },
    panel: { // only for authenticated users
        home: "/panel",
        profile: "/panel/profile",
        users: "/panel/users", // only for admin
        products: "/panel/profile/products",
        auth: "/panel/auth",
        

    },
}

export default links;
