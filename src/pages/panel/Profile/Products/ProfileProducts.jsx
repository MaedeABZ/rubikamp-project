// src/pages/panel/Profile/Products/ProfileProducts.jsx
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext";
import Modal from "@/components/Modal/Modal";
import styles from "./ProfileProducts.module.css";

const makeBorderStyleByError = (bool) => ({
  border: "1px solid " + (bool ? "red" : "black"),
  color: "purple",
  borderRadius: 8,
  margin: "0 4px",
});



const ProductFormManagement = ({
  onSubmit,
  data,
  onCancel,
  hideCloseButton = false,
  cancelButtonText = "Cancel",
}) => {
  const isCreateMode = !data;
  const [error, setError] = useState({
    name: false,
    price: false,
    category: false,
    stock: false,
  });

  // اگر data پاس داده شود یعنی در حالت Edit هستیم، در غیر این صورت Create
  const [form, setForm] = useState({
    name: data?.name || "",
    description: data?.description || "",
    price: data?.price || "",
    category: data?.category || "",
    stock: data?.stock || "",
  });

  // هر بار ورودی تغییر کند، خطا (validation) را بررسی می‌کنیم
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price" || name === "stock") {
      const numberRegex = /^\d*$/;
      setError((prev) => ({ ...prev, [name]: !numberRegex.test(value) }));
      setForm((prev) => ({ ...prev, [name]: value }));
    } else if (name === "name" || name === "category") {
      setError((prev) => ({ ...prev, [name]: value.length < 2 }));
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // هنگام ارسال فرم، بسته به Create/Update، یکی از APIها را فراخوانی می‌کنیم
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isCreateMode) {
      // POST برای ساختن محصول جدید
      fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.product) onSubmit(res.product);
        });
    } else {
      // PUT برای ویرایش محصول موجود
      fetch(`http://localhost:8000/api/products/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.product) onSubmit(res.product);
        });
    }
  };

  const isSubmitDisabled =
    error.name || error.price || error.category || error.stock;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Product Name"
        style={makeBorderStyleByError(error.name)}
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Product Description"
        style={{
          border: "1px solid #ddd",
          color: "purple",
          borderRadius: 8,
          margin: "0 4px",
        }}
      />
      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        style={makeBorderStyleByError(error.price)}
      />
      <input
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
        style={makeBorderStyleByError(error.category)}
      />
      <input
        name="stock"
        value={form.stock}
        onChange={handleChange}
        placeholder="Stock"
        style={makeBorderStyleByError(error.stock)}
      />
      <button
        className={styles.submitButton}
        disabled={isSubmitDisabled}
        type="submit"
      >
        {isCreateMode ? "create" : "update"}
      </button>
      {!hideCloseButton && (
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          {cancelButtonText}
        </button>
      )}
    </form>
  );
};


// این کامپوننت صفحه‌ی اصلی مدیریت محصولات است
const ProfileProducts = () => {
  const { user } = useContext(UserContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);

  // Fetch لیست محصولات از API
  const fetchProducts = async () => {
    const response = await fetch("http://localhost:8000/api/products", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // حذف محصول با ID
  const handleDeleteProduct = (id) => {
    setLoading(true);
    fetch(`http://localhost:8000/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          fetchProducts();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // اگر کاربر ادمین نباشد، دسترسی ندارد
  if (!user.isAdmin) {
    return <div>You are not authorized to access this page</div>;
  }

  return (
    <div className={styles.container}>
      {/* Modal حذف محصول */}
      {deleteProduct && (
        <Modal
          onClose={() => setDeleteProduct(false)}
          onSubmit={() => {
            handleDeleteProduct(deleteProduct.id);
            setDeleteProduct(false);
          }}
          title="Delete Product"
          description={`Are you sure you want to delete ${deleteProduct.name}?`}
        />
      )}

      {/* Modal ساخت محصول جدید */}
      {openCreateProductModal && (
        <Modal
          hideCloseButton={true}
          hideSubmitButton={true}
          title="Create Product"
          description={
            <ProductFormManagement
              data={null}
              onSubmit={(product) => {
                setProducts([...products, product]);
                setOpenCreateProductModal(false);
              }}
              onCancel={() => setOpenCreateProductModal(false)}
              cancelButtonText="close modal"
            />
          }
        />
      )}

      {/* Modal ویرایش محصول */}
      {editProduct && (
        <Modal
          hideCloseButton={true}
          hideSubmitButton={true}
          title="Edit Product"
          description={
            <ProductFormManagement
              data={editProduct}
              onSubmit={() => {
                fetchProducts();
                setEditProduct(null);
              }}
              onCancel={() => setEditProduct(null)}
              cancelButtonText="close modal"
            />
          }
        />
      )}

      {/* عنوان صفحه */}
      <h2 className={styles.title}>products management</h2>

      {/* دکمه‌ی باز کردن Modal ساخت محصول جدید */}
      <button
        className={styles.createButton}
        onClick={() => setOpenCreateProductModal(true)}
      >
        Create Product
      </button>

      <br />

      {/* فیلتر جستجو */}
      <input
        className={styles.searchBox}
        type="text"
        placeholder="by name, description, price, category, or stock"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* جدول نمایش محصولات */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6">Loading...</td>
            </tr>
          ) : (
            products
              .filter(
                (product) =>
                  product.name.includes(search) ||
                  product.description.includes(search) ||
                  product.price.toString().includes(search) ||
                  product.category.includes(search) ||
                  product.stock.toString().includes(search)
              )
              .map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button
                      className={`${styles.actionButton} ${styles.editButton}`}
                      onClick={() => setEditProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => setDeleteProduct(product)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProfileProducts;









