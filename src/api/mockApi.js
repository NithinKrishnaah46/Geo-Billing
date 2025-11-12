import { mockProducts, mockInvoices, mockUsers } from "./mockData";

export const MockAPI = {
  getProducts() {
    return Promise.resolve(mockProducts);
  },

  addProduct(product) {
    product.id = mockProducts.length + 1;
    mockProducts.push(product);
    return Promise.resolve(product);
  },

  createInvoice(invoice) {
    invoice.id = mockInvoices.length + 1;
    invoice.date = new Date().toLocaleString();
    mockInvoices.push(invoice);
    return Promise.resolve(invoice);
  },

  login(username, password) {
    const found = mockUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      localStorage.setItem("loggedInUser", JSON.stringify(found));
      return Promise.resolve(found);
    } else {
      return Promise.reject("Invalid credentials");
    }
  },

  logout() {
    localStorage.removeItem("loggedInUser");
    return Promise.resolve(true);
  },
};
