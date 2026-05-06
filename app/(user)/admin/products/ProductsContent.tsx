"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Tag,
  FolderOpen,
  Percent,
  Pencil,
  Trash2,
  ImageIcon,
  X,
} from "lucide-react";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  createRubrique,
  updateRubrique,
  deleteRubrique,
  createPromotion,
  updatePromotion,
  deletePromotion,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./actions";
import type {
  Category,
  Rubrique,
  Promotion,
  Product,
} from "@/app/generated/prisma/browser";
import Image from "next/image";

type ProductWithRelations = Product & {
  categories: Category[];
  rubriques: Rubrique[];
  promotions: Promotion[];
};

type RelatedItem = {
  id: string;
  name: string;
  title: string;
  description: string;
  imageFile: File | null;
  imagePreview: string | null;
};

type GarantieItem = {
  id: string;
  title: string;
  description: string;
  duree_garantie: string;
};

function newRelatedItem(): RelatedItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    title: "",
    description: "",
    imageFile: null,
    imagePreview: null,
  };
}

function newGarantieItem(): GarantieItem {
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    duree_garantie: "",
  };
}

function RelatedSection({
  label,
  addLabel,
  items,
  setItems,
}: {
  label: string;
  addLabel: string;
  items: RelatedItem[];
  setItems: React.Dispatch<React.SetStateAction<RelatedItem[]>>;
}) {
  const updateItem = (id: string, upd: Partial<RelatedItem>) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...upd } : i))
    );
  };
  const removeItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item?.imagePreview) URL.revokeObjectURL(item.imagePreview);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };
  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </span>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 space-y-2"
          >
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <input
                type="text"
                placeholder="Nom"
                value={item.name}
                onChange={(e) => updateItem(item.id, { name: e.target.value })}
                className="flex-1 min-w-0 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              <input
                type="text"
                placeholder="Titre"
                value={item.title}
                onChange={(e) => updateItem(item.id, { title: e.target.value })}
                className="flex-1 min-w-0 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="shrink-0 rounded p-1.5 text-red-600 hover:bg-red-50"
                aria-label="Supprimer"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <textarea
              placeholder="Description"
              value={item.description}
              onChange={(e) => updateItem(item.id, { description: e.target.value })}
              rows={2}
              className="w-full resize-y rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            <div className="flex items-center gap-2">
              <input
                id={`img-${item.id}`}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (item.imagePreview) URL.revokeObjectURL(item.imagePreview);
                  updateItem(item.id, {
                    imageFile: file,
                    imagePreview: URL.createObjectURL(file),
                  });
                  e.target.value = "";
                }}
              />
              <label
                htmlFor={`img-${item.id}`}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <ImageIcon className="size-4" />
                Image
              </label>
              {item.imagePreview && (
                <div className="relative shrink-0">
                  <Image
                    width={48}
                    height={48}
                    src={item.imagePreview}
                    alt="Aperçu"
                    className="size-12 rounded object-cover ring-1 ring-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (item.imagePreview) URL.revokeObjectURL(item.imagePreview);
                      updateItem(item.id, { imageFile: null, imagePreview: null });
                    }}
                    className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
                    aria-label="Retirer image"
                  >
                    <X className="size-2.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setItems((prev) => [...prev, newRelatedItem()])}
          className="gap-1.5 border-dashed"
        >
          <Plus className="size-4" />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}

function GarantieSection({
  items,
  setItems,
}: {
  items: GarantieItem[];
  setItems: React.Dispatch<React.SetStateAction<GarantieItem[]>>;
}) {
  const updateItem = (id: string, upd: Partial<GarantieItem>) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...upd } : i))
    );
  };
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };
  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-gray-700">
        Garantie
      </span>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 space-y-2"
          >
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <input
                type="text"
                placeholder="Titre"
                value={item.title}
                onChange={(e) => updateItem(item.id, { title: e.target.value })}
                className="flex-1 min-w-0 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              <input
                type="number"
                min={0}
                placeholder="Durée (mois)"
                value={item.duree_garantie}
                onChange={(e) =>
                  updateItem(item.id, { duree_garantie: e.target.value })
                }
                className="w-24 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="shrink-0 rounded p-1.5 text-red-600 hover:bg-red-50"
                aria-label="Supprimer"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <textarea
              placeholder="Description"
              value={item.description}
              onChange={(e) => updateItem(item.id, { description: e.target.value })}
              rows={2}
              className="w-full resize-y rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setItems((prev) => [...prev, newGarantieItem()])}
          className="gap-1.5 border-dashed"
        >
          <Plus className="size-4" />
          Ajouter Garantie
        </Button>
      </div>
    </div>
  );
}

type TabId = "categorie" | "rubrique" | "promotion" | "ajouter";

const TABS_LEFT: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "categorie", label: "Categorie", icon: <FolderOpen className="size-4" /> },
  { id: "rubrique", label: "Rubrique", icon: <Tag className="size-4" /> },
  { id: "promotion", label: "Promotion", icon: <Percent className="size-4" /> },
];

type ProductsContentProps = {
  categories: Category[];
  rubriques: Rubrique[];
  promotions: Promotion[];
  products: ProductWithRelations[];
};

export function ProductsContent({
  categories,
  rubriques,
  promotions,
  products,
}: ProductsContentProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("ajouter");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddRubriqueModal, setShowAddRubriqueModal] = useState(false);
  const [showAddPromotionModal, setShowAddPromotionModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRubriqueId, setEditingRubriqueId] = useState<string | null>(null);
  const [editingPromotionId, setEditingPromotionId] = useState<string | null>(
    null
  );
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editRubriqueName, setEditRubriqueName] = useState("");
  const [editPromotionName, setEditPromotionName] = useState("");
  const [editPromotionTaux, setEditPromotionTaux] = useState("");
  const [editProductName, setEditProductName] = useState("");
  const [editProductPrice, setEditProductPrice] = useState("");
  const [editProductStock, setEditProductStock] = useState("");
  const [editProductCategoryIds, setEditProductCategoryIds] = useState<
    string[]
  >([]);
  const [editProductRubriqueIds, setEditProductRubriqueIds] = useState<
    string[]
  >([]);
  const [editProductPromotionIds, setEditProductPromotionIds] = useState<
    string[]
  >([]);
  const [addName, setAddName] = useState("");
  const [addRubriqueName, setAddRubriqueName] = useState("");
  const [addPromotionName, setAddPromotionName] = useState("");
  const [addPromotionTaux, setAddPromotionTaux] = useState("");
  const [addProductName, setAddProductName] = useState("");
  const [addProductDescription, setAddProductDescription] = useState("");
  const [addProductPrice, setAddProductPrice] = useState("");
  const [addProductStock, setAddProductStock] = useState("");
  const [addProductCategoryIds, setAddProductCategoryIds] = useState<string[]>(
    []
  );
  const [addProductRubriqueIds, setAddProductRubriqueIds] = useState<string[]>(
    []
  );
  const [addProductPromotionIds, setAddProductPromotionIds] = useState<
    string[]
  >([]);
  const [addProductImagePreview, setAddProductImagePreview] = useState<
    string | null
  >(null);
  const [addProductCTs, setAddProductCTs] = useState<RelatedItem[]>([]);
  const [addProductGaranties, setAddProductGaranties] = useState<GarantieItem[]>(
    []
  );
  const [addProductFiches, setAddProductFiches] = useState<RelatedItem[]>([]);
  const [addProductDescriptions, setAddProductDescriptions] = useState<
    RelatedItem[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addProductImageRef = useRef<HTMLInputElement>(null);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.set("name", addName.trim());
    const result = await createCategory(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setShowAddModal(false);
      setAddName("");
      router.refresh();
    }
    setLoading(false);
  };

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.set("name", editName.trim());
    const result = await updateCategory(editingId, formData);
    if (result.error) {
      setError(result.error);
    } else {
      setEditingId(null);
      setEditName("");
      router.refresh();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    setLoading(true);
    setError(null);
    const result = await deleteCategory(id);
    if (result.error) {
      setError(result.error);
    } else {
      if (editingId === id) handleCancelEdit();
      router.refresh();
    }
    setLoading(false);
  };

  // Rubrique handlers
  const handleAddRubrique = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.set("name", addRubriqueName.trim());
    const result = await createRubrique(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setShowAddRubriqueModal(false);
      setAddRubriqueName("");
      router.refresh();
    }
    setLoading(false);
  };

  const handleStartEditRubrique = (rub: Rubrique) => {
    setEditingRubriqueId(rub.id);
    setEditRubriqueName(rub.name);
    setError(null);
  };

  const handleCancelEditRubrique = () => {
    setEditingRubriqueId(null);
    setEditRubriqueName("");
    setError(null);
  };

  const handleSaveEditRubrique = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRubriqueId) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.set("name", editRubriqueName.trim());
    const result = await updateRubrique(editingRubriqueId, formData);
    if (result.error) {
      setError(result.error);
    } else {
      setEditingRubriqueId(null);
      setEditRubriqueName("");
      router.refresh();
    }
    setLoading(false);
  };

  const handleDeleteRubrique = async (id: string) => {
    if (!confirm("Supprimer cette rubrique ?")) return;
    setLoading(true);
    setError(null);
    const result = await deleteRubrique(id);
    if (result.error) {
      setError(result.error);
    } else {
      if (editingRubriqueId === id) handleCancelEditRubrique();
      router.refresh();
    }
    setLoading(false);
  };

  // Promotion handlers
  const handleAddPromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.set("name", addPromotionName.trim());
    formData.set("taux", addPromotionTaux);
    const result = await createPromotion(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setShowAddPromotionModal(false);
      setAddPromotionName("");
      setAddPromotionTaux("");
      router.refresh();
    }
    setLoading(false);
  };

  const handleStartEditPromotion = (prom: Promotion) => {
    setEditingPromotionId(prom.id);
    setEditPromotionName(prom.name);
    setEditPromotionTaux(String(prom.taux));
    setError(null);
  };

  const handleCancelEditPromotion = () => {
    setEditingPromotionId(null);
    setEditPromotionName("");
    setEditPromotionTaux("");
    setError(null);
  };

  const handleSaveEditPromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromotionId) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.set("name", editPromotionName.trim());
    formData.set("taux", editPromotionTaux);
    const result = await updatePromotion(editingPromotionId, formData);
    if (result.error) {
      setError(result.error);
    } else {
      handleCancelEditPromotion();
      router.refresh();
    }
    setLoading(false);
  };

  const handleDeletePromotion = async (id: string) => {
    if (!confirm("Supprimer cette promotion ?")) return;
    setLoading(true);
    setError(null);
    const result = await deletePromotion(id);
    if (result.error) {
      setError(result.error);
    } else {
      if (editingPromotionId === id) handleCancelEditPromotion();
      router.refresh();
    }
    setLoading(false);
  };

  // Product handlers
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.set("name", addProductName.trim());
    formData.set("description", addProductDescription.trim());
    formData.set("price", addProductPrice);
    formData.set("stock", addProductStock);
    addProductCategoryIds.forEach((id) => formData.append("categoryIds", id));
    addProductRubriqueIds.forEach((id) =>
      formData.append("rubriqueIds", id)
    );
    addProductPromotionIds.forEach((id) =>
      formData.append("promotionIds", id)
    );
    const imageFile = addProductImageRef.current?.files?.[0];
    if (imageFile) formData.set("image", imageFile);

    const addRelatedToFormData = (
      items: RelatedItem[],
      metaKey: string,
      imagePrefix: string
    ) => {
      const valid = items.filter((i) => i.name.trim() && i.title.trim());
      formData.set(metaKey, JSON.stringify(valid.map(({ name, title, description }) => ({ name, title, description }))));
      valid.forEach((item, i) => {
        if (item.imageFile) formData.set(`${imagePrefix}_${i}`, item.imageFile);
      });
    };
    addRelatedToFormData(addProductCTs, "ct_meta", "ct_image");
    const validGaranties = addProductGaranties.filter(
      (i) => i.title.trim() && i.description.trim()
    );
    formData.set(
      "g_meta",
      JSON.stringify(
        validGaranties.map(({ title, description, duree_garantie }) => ({
          title,
          description,
          duree_garantie: duree_garantie.trim() || undefined,
        }))
      )
    );
    addRelatedToFormData(addProductFiches, "ft_meta", "ft_image");
    addRelatedToFormData(addProductDescriptions, "dt_meta", "dt_image");

    const result = await createProduct(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setShowAddProductModal(false);
      setAddProductName("");
      setAddProductDescription("");
      setAddProductPrice("");
      setAddProductStock("");
      setAddProductCategoryIds([]);
      setAddProductRubriqueIds([]);
      setAddProductPromotionIds([]);
      if (addProductImagePreview) {
        URL.revokeObjectURL(addProductImagePreview);
      }
      setAddProductImagePreview(null);
      if (addProductImageRef.current) {
        addProductImageRef.current.value = "";
      }
      [addProductCTs, addProductFiches, addProductDescriptions].forEach(
        (arr) => arr.forEach((i) => "imagePreview" in i && i.imagePreview && URL.revokeObjectURL(i.imagePreview))
      );
      setAddProductCTs([]);
      setAddProductGaranties([]);
      setAddProductFiches([]);
      setAddProductDescriptions([]);
      router.refresh();
    }
    setLoading(false);
  };

  const toggleAddProductCategory = (categoryId: string) => {
    setAddProductCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleAddProductRubrique = (rubriqueId: string) => {
    setAddProductRubriqueIds((prev) =>
      prev.includes(rubriqueId)
        ? prev.filter((id) => id !== rubriqueId)
        : [...prev, rubriqueId]
    );
  };

  const toggleAddProductPromotion = (promotionId: string) => {
    setAddProductPromotionIds((prev) =>
      prev.includes(promotionId)
        ? prev.filter((id) => id !== promotionId)
        : [...prev, promotionId]
    );
  };

  const handleStartEditProduct = (prod: ProductWithRelations) => {
    setEditingProductId(prod.id);
    setEditProductName(prod.name);
    setEditProductPrice(Number(prod.price).toString());
    setEditProductStock(String(prod.stock));
    setEditProductCategoryIds(prod.categories.map((c) => c.id));
    setEditProductRubriqueIds(prod.rubriques.map((r) => r.id));
    setEditProductPromotionIds(prod.promotions.map((p) => p.id));
    setError(null);
  };

  const handleCancelEditProduct = () => {
    setEditingProductId(null);
    setEditProductName("");
    setEditProductPrice("");
    setEditProductStock("");
    setEditProductCategoryIds([]);
    setEditProductRubriqueIds([]);
    setEditProductPromotionIds([]);
    setError(null);
  };

  const toggleEditProductCategory = (categoryId: string) => {
    setEditProductCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleEditProductRubrique = (rubriqueId: string) => {
    setEditProductRubriqueIds((prev) =>
      prev.includes(rubriqueId)
        ? prev.filter((id) => id !== rubriqueId)
        : [...prev, rubriqueId]
    );
  };

  const toggleEditProductPromotion = (promotionId: string) => {
    setEditProductPromotionIds((prev) =>
      prev.includes(promotionId)
        ? prev.filter((id) => id !== promotionId)
        : [...prev, promotionId]
    );
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.set("name", editProductName.trim());
    formData.set("price", editProductPrice);
    formData.set("stock", editProductStock);
    editProductCategoryIds.forEach((id) =>
      formData.append("categoryIds", id)
    );
    editProductRubriqueIds.forEach((id) =>
      formData.append("rubriqueIds", id)
    );
    editProductPromotionIds.forEach((id) =>
      formData.append("promotionIds", id)
    );
    const result = await updateProduct(editingProductId, formData);
    if (result.error) {
      setError(result.error);
    } else {
      handleCancelEditProduct();
      router.refresh();
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    setLoading(true);
    setError(null);
    const result = await deleteProduct(id);
    if (result.error) {
      setError(result.error);
    } else {
      if (editingProductId === id) handleCancelEditProduct();
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Produits
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Gérez vos catégories, rubriques, promotions et produits
        </p>
      </div>
      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      {/* Tab bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 bg-linear-to-r from-gray-50/80 to-white px-4 py-2 sm:px-6">
        <div className="flex gap-0.5 rounded-xl bg-gray-100/80 p-1">
          {TABS_LEFT.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200 sm:px-4",
                activeTab === tab.id
                  ? "bg-white text-orange-600 shadow-sm ring-1 ring-gray-200/80"
                  : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setActiveTab("ajouter")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
            activeTab === "ajouter"
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/25 hover:bg-orange-600"
              : "bg-orange-500 text-white shadow-sm hover:bg-orange-600 hover:shadow-md hover:shadow-orange-500/20"
          )}
        >
          <Plus className="size-4" />
          Ajouter Produits
        </button>
      </div>

      {/* Tab content */}
      <div className="rounded-b-2xl bg-white p-4 sm:p-6 lg:p-8">
        {activeTab === "categorie" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Gestion des Catégories
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Organisez vos produits par catégories
                </p>
              </div>
              <Button
                onClick={() => {
                  setShowAddModal(true);
                  setError(null);
                }}
                className="shrink-0 gap-2 bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="size-4" />
                Ajouter Catégorie
              </Button>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200/80 shadow-sm">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Nom
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Slug
                    </th>
                    <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-12 text-center text-gray-500">
                        Aucune catégorie. Cliquez sur &quot;Ajouter Catégorie&quot; pour en créer.
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat, i) => (
                      <tr
                        key={cat.id}
                        className={cn(
                          "transition-colors hover:bg-orange-50/50",
                          i % 2 === 1 && "bg-gray-50/30"
                        )}
                      >
                        <td className="px-4 py-3">
                          {editingId === cat.id ? (
                            <form onSubmit={handleSaveEdit} className="flex gap-2">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                required
                                autoFocus
                              />
                              <Button type="submit" size="sm" disabled={loading}>
                                Enregistrer
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEdit}
                              >
                                Annuler
                              </Button>
                            </form>
                          ) : (
                            <span className="font-medium text-gray-900">
                              {cat.name}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {cat.slug}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {editingId === cat.id ? null : (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStartEdit(cat)}
                                className="gap-1"
                              >
                                <Pencil className="size-3.5" />
                                Editer
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(cat.id)}
                                disabled={loading}
                                className="gap-1"
                              >
                                <Trash2 className="size-3.5" />
                                Suprimer
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "rubrique" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Gestion des Rubriques
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Créez des rubriques pour classer vos produits
                </p>
              </div>
              <Button
                onClick={() => {
                  setShowAddRubriqueModal(true);
                  setError(null);
                }}
                className="shrink-0 gap-2 bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="size-4" />
                Ajouter Rubrique
              </Button>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200/80 shadow-sm">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Nom
                    </th>
                    <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {rubriques.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-4 py-12 text-center text-gray-500">
                        Aucune rubrique. Cliquez sur &quot;Ajouter Rubrique&quot; pour en créer.
                      </td>
                    </tr>
                  ) : (
                    rubriques.map((rub, i) => (
                      <tr
                        key={rub.id}
                        className={cn(
                          "transition-colors hover:bg-orange-50/50",
                          i % 2 === 1 && "bg-gray-50/30"
                        )}
                      >
                        <td className="px-4 py-3">
                          {editingRubriqueId === rub.id ? (
                            <form onSubmit={handleSaveEditRubrique} className="flex gap-2">
                              <input
                                type="text"
                                value={editRubriqueName}
                                onChange={(e) => setEditRubriqueName(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                required
                                autoFocus
                              />
                              <Button type="submit" size="sm" disabled={loading}>
                                Enregistrer
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEditRubrique}
                              >
                                Annuler
                              </Button>
                            </form>
                          ) : (
                            <span className="font-medium text-gray-900">
                              {rub.name}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {editingRubriqueId === rub.id ? null : (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStartEditRubrique(rub)}
                                className="gap-1"
                              >
                                <Pencil className="size-3.5" />
                                Editer
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteRubrique(rub.id)}
                                disabled={loading}
                                className="gap-1"
                              >
                                <Trash2 className="size-3.5" />
                                Suprimer
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "promotion" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Gestion des Promotions
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Définissez des réductions et offres promotionnelles
                </p>
              </div>
              <Button
                onClick={() => {
                  setShowAddPromotionModal(true);
                  setError(null);
                }}
                className="shrink-0 gap-2 bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="size-4" />
                Ajouter Promotion
              </Button>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200/80 shadow-sm">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Nom
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Taux (%)
                    </th>
                    <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {promotions.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-12 text-center text-gray-500">
                        Aucune promotion. Cliquez sur &quot;Ajouter Promotion&quot; pour en créer.
                      </td>
                    </tr>
                  ) : (
                    promotions.map((prom, i) => (
                      <tr
                        key={prom.id}
                        className={cn(
                          "transition-colors hover:bg-orange-50/50",
                          i % 2 === 1 && "bg-gray-50/30"
                        )}
                      >
                        <td
                          className="px-4 py-3"
                          colSpan={editingPromotionId === prom.id ? 2 : 1}
                        >
                          {editingPromotionId === prom.id ? (
                            <form
                              onSubmit={handleSaveEditPromotion}
                              className="flex flex-wrap items-center gap-2"
                            >
                              <input
                                type="text"
                                value={editPromotionName}
                                onChange={(e) =>
                                  setEditPromotionName(e.target.value)
                                }
                                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                placeholder="Nom"
                                required
                                autoFocus
                              />
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={editPromotionTaux}
                                onChange={(e) =>
                                  setEditPromotionTaux(e.target.value)
                                }
                                className="w-20 rounded border border-gray-300 px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="%"
                              />
                              <Button type="submit" size="sm" disabled={loading}>
                                Enregistrer
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEditPromotion}
                              >
                                Annuler
                              </Button>
                            </form>
                          ) : (
                            <span className="font-medium text-gray-900">
                              {prom.name}
                            </span>
                          )}
                        </td>
                        {editingPromotionId !== prom.id && (
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {prom.taux} %
                          </td>
                        )}
                        <td className="px-4 py-3 text-right">
                          {editingPromotionId === prom.id ? null : (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleStartEditPromotion(prom)
                                }
                                className="gap-1"
                              >
                                <Pencil className="size-3.5" />
                                Editer
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeletePromotion(prom.id)}
                                disabled={loading}
                                className="gap-1"
                              >
                                <Trash2 className="size-3.5" />
                                Suprimer
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "ajouter" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Gestion des Produits
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Ajoutez et gérez votre catalogue de produits
                </p>
              </div>
              <Button
                onClick={() => {
                  setShowAddProductModal(true);
                  setError(null);
                }}
                className="shrink-0 gap-2 bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="size-4" />
                Ajouter Produits
              </Button>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200/80 shadow-sm">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Nom
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Prix
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Stock
                    </th>
                    <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                        Aucun produit. Cliquez sur &quot;Ajouter Produits&quot; pour en créer.
                      </td>
                    </tr>
                  ) : (
                    products.map((prod, i) => (
                      <tr
                        key={prod.id}
                        className={cn(
                          "transition-colors hover:bg-orange-50/50",
                          i % 2 === 1 && "bg-gray-50/30"
                        )}
                      >
                        <td
                          className="px-4 py-3"
                          colSpan={editingProductId === prod.id ? 4 : 1}
                        >
                          {editingProductId === prod.id ? (
                            <form
                              onSubmit={handleSaveEditProduct}
                              className="space-y-3"
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <input
                                  type="text"
                                  value={editProductName}
                                  onChange={(e) =>
                                    setEditProductName(e.target.value)
                                  }
                                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                  placeholder="Nom"
                                  required
                                  autoFocus
                                />
                                <input
                                  type="number"
                                  step="0.01"
                                  min={0}
                                  value={editProductPrice}
                                  onChange={(e) =>
                                    setEditProductPrice(e.target.value)
                                  }
                                  className="w-24 rounded border border-gray-300 px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                  placeholder="Prix"
                                />
                                <input
                                  type="number"
                                  min={0}
                                  value={editProductStock}
                                  onChange={(e) =>
                                    setEditProductStock(e.target.value)
                                  }
                                  className="w-20 rounded border border-gray-300 px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                  placeholder="Stock"
                                />
                                <Button
                                  type="submit"
                                  size="sm"
                                  disabled={loading}
                                >
                                  Enregistrer
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={handleCancelEditProduct}
                                >
                                  Annuler
                                </Button>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <span className="mb-1 block text-xs font-medium text-gray-600">
                                    Catégories
                                  </span>
                                  <div className="max-h-24 space-y-1 overflow-y-auto rounded border border-gray-300 p-2">
                                    {categories.map((c) => (
                                      <label
                                        key={c.id}
                                        className="flex cursor-pointer items-center gap-1.5"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={editProductCategoryIds.includes(
                                            c.id
                                          )}
                                          onChange={() =>
                                            toggleEditProductCategory(c.id)
                                          }
                                          className="size-3.5 rounded border-gray-300 text-orange-500"
                                        />
                                        <span className="text-xs">
                                          {c.name}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <span className="mb-1 block text-xs font-medium text-gray-600">
                                    Rubriques
                                  </span>
                                  <div className="max-h-24 space-y-1 overflow-y-auto rounded border border-gray-300 p-2">
                                    {rubriques.map((r) => (
                                      <label
                                        key={r.id}
                                        className="flex cursor-pointer items-center gap-1.5"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={editProductRubriqueIds.includes(
                                            r.id
                                          )}
                                          onChange={() =>
                                            toggleEditProductRubrique(r.id)
                                          }
                                          className="size-3.5 rounded border-gray-300 text-orange-500"
                                        />
                                        <span className="text-xs">
                                          {r.name}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <span className="mb-1 block text-xs font-medium text-gray-600">
                                    Promotions
                                  </span>
                                  <div className="max-h-24 space-y-1 overflow-y-auto rounded border border-gray-300 p-2">
                                    {promotions.map((p) => (
                                      <label
                                        key={p.id}
                                        className="flex cursor-pointer items-center gap-1.5"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={editProductPromotionIds.includes(
                                            p.id
                                          )}
                                          onChange={() =>
                                            toggleEditProductPromotion(p.id)
                                          }
                                          className="size-3.5 rounded border-gray-300 text-orange-500"
                                        />
                                        <span className="text-xs">
                                          {p.name} ({p.taux}%)
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </form>
                          ) : (
                            <span className="font-medium text-gray-900">
                              {prod.name}
                            </span>
                          )}
                        </td>
                        {editingProductId !== prod.id && (
                          <>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {Number(prod.price).toFixed(2)} FCFA
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {prod.stock}
                            </td>
                            <td className="px-4 py-3 text-right">
                          {editingProductId === prod.id ? null : (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleStartEditProduct(prod)
                                }
                                className="gap-1"
                              >
                                <Pencil className="size-3.5" />
                                Editer
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteProduct(prod.id)}
                                disabled={loading}
                                className="gap-1"
                              >
                                <Trash2 className="size-3.5" /                              >
                                Suprimer
                              </Button>
                            </div>
                          )}
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Ajouter Catégorie */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xl shadow-black/10">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Ajouter une Catégorie
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label
                  htmlFor="add-name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Nom de la catégorie
                </label>
                <input
                  id="add-name"
                  type="text"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="Ex: Électronique"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 gap-2 bg-orange-500 hover:bg-orange-600"
                >
                  {loading ? "Création…" : "Créer"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setAddName("");
                    setError(null);
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajouter Rubrique */}
      {showAddRubriqueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xl shadow-black/10">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Ajouter une Rubrique
            </h2>
            <form onSubmit={handleAddRubrique} className="space-y-4">
              <div>
                <label
                  htmlFor="add-rubrique-name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Nom de la rubrique
                </label>
                <input
                  id="add-rubrique-name"
                  type="text"
                  value={addRubriqueName}
                  onChange={(e) => setAddRubriqueName(e.target.value)}
                  placeholder="Ex: Nouveautés"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 gap-2 bg-orange-500 hover:bg-orange-600"
                >
                  {loading ? "Création…" : "Créer"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddRubriqueModal(false);
                    setAddRubriqueName("");
                    setError(null);
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajouter Promotion */}
      {showAddPromotionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xl shadow-black/10">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Ajouter une Promotion
            </h2>
            <form onSubmit={handleAddPromotion} className="space-y-4">
              <div>
                <label
                  htmlFor="add-promotion-name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Nom de la promotion
                </label>
                <input
                  id="add-promotion-name"
                  type="text"
                  value={addPromotionName}
                  onChange={(e) => setAddPromotionName(e.target.value)}
                  placeholder="Ex: Soldes d'été"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="add-promotion-taux"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Taux de réduction (%)
                </label>
                <input
                  id="add-promotion-taux"
                  type="number"
                  min={0}
                  max={100}
                  value={addPromotionTaux}
                  onChange={(e) => setAddPromotionTaux(e.target.value)}
                  placeholder="10"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 gap-2 bg-orange-500 hover:bg-orange-600"
                >
                  {loading ? "Création…" : "Créer"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddPromotionModal(false);
                    setAddPromotionName("");
                    setAddPromotionTaux("");
                    setError(null);
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajouter Produit */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xl shadow-black/10 sm:max-w-xl">
            <h2 className="shrink-0 border-b border-gray-100 px-6 py-4 text-lg font-semibold text-gray-900">
              Ajouter un Produit
            </h2>
            <form
              onSubmit={handleAddProduct}
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
              <div>
                <label
                  htmlFor="add-product-name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Nom du produit
                </label>
                <input
                  id="add-product-name"
                  type="text"
                  value={addProductName}
                  onChange={(e) => setAddProductName(e.target.value)}
                  placeholder="Ex: Téléphone Samsung"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="add-product-description"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="add-product-description"
                  value={addProductDescription}
                  onChange={(e) => setAddProductDescription(e.target.value)}
                  placeholder="Décrivez le produit..."
                  rows={3}
                  className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div>
                <label
                  htmlFor="add-product-image"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Image du produit
                </label>
                <div className="flex items-start gap-3">
                  <div className="relative flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 px-4 py-6 transition-colors hover:border-orange-300 hover:bg-orange-50/30">
                    <input
                      ref={addProductImageRef}
                      id="add-product-image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (addProductImagePreview) {
                          URL.revokeObjectURL(addProductImagePreview);
                        }
                        if (file) {
                          setAddProductImagePreview(URL.createObjectURL(file));
                        } else {
                          setAddProductImagePreview(null);
                        }
                      }}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <ImageIcon className="mb-2 size-10 text-gray-400" />
                    <p className="text-center text-sm text-gray-600">
                      Cliquez ou glissez une image
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      JPEG, PNG, WebP, GIF — max 5 Mo
                    </p>
                  </div>
                  {addProductImagePreview && (
                    <div className="relative shrink-0">
                     
                      <Image
                        width={80}
                        height={80}
                        src={addProductImagePreview}
                        alt="Aperçu"
                        className="size-20 rounded-lg object-cover ring-2 ring-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (addProductImagePreview) {
                            URL.revokeObjectURL(addProductImagePreview);
                          }
                          setAddProductImagePreview(null);
                          if (addProductImageRef.current) {
                            addProductImageRef.current.value = "";
                          }
                        }}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="add-product-price"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Prix (FCFA)
                  </label>
                  <input
                    id="add-product-price"
                    type="number"
                    step="0.01"
                    min={0}
                    value={addProductPrice}
                    onChange={(e) => setAddProductPrice(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="add-product-stock"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Stock
                  </label>
                  <input
                    id="add-product-stock"
                    type="number"
                    min={0}
                    value={addProductStock}
                    onChange={(e) => setAddProductStock(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
              <div>
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Catégories
                </span>
                <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50/50 p-3">
                  {categories.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Aucune catégorie. Créez-en dans l&apos;onglet Catégorie.
                    </p>
                  ) : (
                    categories.map((c) => (
                      <label
                        key={c.id}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={addProductCategoryIds.includes(c.id)}
                          onChange={() => toggleAddProductCategory(c.id)}
                          className="size-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500/30"
                        />
                        <span className="text-sm text-gray-900">{c.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
              <div>
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Rubriques
                </span>
                <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50/50 p-3">
                  {rubriques.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Aucune rubrique. Créez-en dans l&apos;onglet Rubrique.
                    </p>
                  ) : (
                    rubriques.map((r) => (
                      <label
                        key={r.id}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={addProductRubriqueIds.includes(r.id)}
                          onChange={() => toggleAddProductRubrique(r.id)}
                          className="size-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500/30"
                        />
                        <span className="text-sm text-gray-900">{r.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
              <div>
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Promotions
                </span>
                <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50/50 p-3">
                  {promotions.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Aucune promotion. Créez-en dans l&apos;onglet Promotion.
                    </p>
                  ) : (
                    promotions.map((p) => (
                      <label
                        key={p.id}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={addProductPromotionIds.includes(p.id)}
                          onChange={() => toggleAddProductPromotion(p.id)}
                          className="size-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500/30"
                        />
                        <span className="text-sm text-gray-900">
                          {p.name} ({p.taux}%)
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Caractéristique Technique */}
              <RelatedSection
                label="Caractéristique Technique"
                addLabel="Ajouter caracteristique Technique"
                items={addProductCTs}
                setItems={setAddProductCTs}
              />
              {/* Garantie */}
              <GarantieSection
                items={addProductGaranties}
                setItems={setAddProductGaranties}
              />
              {/* Fiche Technique */}
              <RelatedSection
                label="Fiche Technique"
                addLabel="Ajouter Fiche Technique"
                items={addProductFiches}
                setItems={setAddProductFiches}
              />
              {/* Description Technique */}
              <RelatedSection
                label="Description Technique"
                addLabel="Ajouter descriptions Techniques"
                items={addProductDescriptions}
                setItems={setAddProductDescriptions}
              />
                </div>
              </div>
              <div className="shrink-0 border-t border-gray-100 px-6 py-4">
                {error && (
                  <p className="mb-3 text-sm text-red-600">{error}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 gap-2 bg-orange-500 hover:bg-orange-600"
                  >
                    {loading ? "Création…" : "Créer"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddProductModal(false);
                      setAddProductName("");
                      setAddProductDescription("");
                      setAddProductPrice("");
                      setAddProductStock("");
                      setAddProductCategoryIds([]);
                      setAddProductRubriqueIds([]);
                      setAddProductPromotionIds([]);
                      if (addProductImagePreview) {
                        URL.revokeObjectURL(addProductImagePreview);
                      }
                      setAddProductImagePreview(null);
                      if (addProductImageRef.current) {
                        addProductImageRef.current.value = "";
                      }
                      [addProductCTs, addProductFiches, addProductDescriptions].forEach(
                        (arr) => arr.forEach((i) => "imagePreview" in i && i.imagePreview && URL.revokeObjectURL(i.imagePreview))
                      );
                      setAddProductCTs([]);
                      setAddProductGaranties([]);
                      setAddProductFiches([]);
                      setAddProductDescriptions([]);
                      setError(null);
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
