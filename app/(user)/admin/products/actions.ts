"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadProductImage } from "@/lib/upload";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getCategories() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const admin = await prisma.user.findFirst({
    where: { clerkId, role: "ADMIN" },
  });
  if (!admin) return null;

  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createCategory(formData: FormData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { error: "Non authentifié" };

  const admin = await prisma.user.findFirst({
    where: { clerkId, role: "ADMIN" },
  });
  if (!admin) return { error: "Accès refusé" };

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Le nom est requis" };

  const slug = slugify(name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return { error: "Une catégorie avec ce nom existe déjà" };

  await prisma.category.create({ data: { name, slug } });
  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { error: "Non authentifié" };

  const admin = await prisma.user.findFirst({
    where: { clerkId, role: "ADMIN" },
  });
  if (!admin) return { error: "Accès refusé" };

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Le nom est requis" };

  const slug = slugify(name);
  const existing = await prisma.category.findFirst({
    where: { slug, NOT: { id } },
  });
  if (existing) return { error: "Une catégorie avec ce nom existe déjà" };

  await prisma.category.update({ where: { id }, data: { name, slug } });
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { error: "Non authentifié" };

  const admin = await prisma.user.findFirst({
    where: { clerkId, role: "ADMIN" },
  });
  if (!admin) return { error: "Accès refusé" };

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/products");
  return { success: true };
}

// Rubrique
export async function getRubriques() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const admin = await prisma.user.findFirst({
    where: { clerkId, role: "ADMIN" },
  });
  if (!admin) return null;

  return prisma.rubrique.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createRubrique(formData: FormData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { error: "Non authentifié" };

  const admin = await prisma.user.findFirst({
    where: { clerkId, role: "ADMIN" },
  });
  if (!admin) return { error: "Accès refusé" };

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Le nom est requis" };

  const existing = await prisma.rubrique.findFirst({ where: { name } });
  if (existing) return { error: "Une rubrique avec ce nom existe déjà" };

  await prisma.rubrique.create({ data: { name } });
  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateRubrique(id: string, formData: FormData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { error: "Non authentifié" };

  const admin = await prisma.user.findFirst({
    where: { clerkId, role: "ADMIN" },
  });
  if (!admin) return { error: "Accès refusé" };

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Le nom est requis" };

  const existing = await prisma.rubrique.findFirst({
    where: { name, NOT: { id } },
  });
  if (existing) return { error: "Une rubrique avec ce nom existe déjà" };

  await prisma.rubrique.update({ where: { id }, data: { name } });
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteRubrique(id: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { error: "Non authentifié" };

  const admin = await prisma.user.findFirst({
    where: { clerkId, role: "ADMIN" },
  });
  if (!admin) return { error: "Accès refusé" };

  await prisma.rubrique.delete({ where: { id } });
  revalidatePath("/admin/products");
  return { success: true };
}

// Promotion
export async function getPromotions() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const admin = await prisma.user.findFirst({
    where: { clerkId, role: "ADMIN" },
  });
  if (!admin) return null;

  return prisma.promotion.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createPromotion(formData: FormData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { error: "Non authentifié" };

  const admin = await prisma.user.findFirst({
    where: { clerkId, role: "ADMIN" },
  });
  if (!admin) return { error: "Accès refusé" };

  const name = (formData.get("name") as string)?.trim();
  const tauxStr = formData.get("taux") as string;
  if (!name) return { error: "Le nom est requis" };
  const taux = parseInt(tauxStr || "0", 10);
  if (isNaN(taux) || taux < 0 || taux > 100) {
    return { error: "Le taux doit être entre 0 et 100" };
  }

  await prisma.promotion.create({ data: { name, taux } });
  revalidatePath("/admin/products");
  return { success: true };
}

export async function updatePromotion(id: string, formData: FormData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { error: "Non authentifié" };

  const admin = await prisma.user.findFirst({
    where: { clerkId, role: "ADMIN" },
  });
  if (!admin) return { error: "Accès refusé" };

  const name = (formData.get("name") as string)?.trim();
  const tauxStr = formData.get("taux") as string;
  if (!name) return { error: "Le nom est requis" };
  const taux = parseInt(tauxStr || "0", 10);
  if (isNaN(taux) || taux < 0 || taux > 100) {
    return { error: "Le taux doit être entre 0 et 100" };
  }

  await prisma.promotion.update({ where: { id }, data: { name, taux } });
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deletePromotion(id: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { error: "Non authentifié" };

  const admin = await prisma.user.findFirst({
    where: { clerkId, role: "ADMIN" },
  });
  if (!admin) return { error: "Accès refusé" };

  await prisma.promotion.delete({ where: { id } });
  revalidatePath("/admin/products");
  return { success: true };
}

// Product
export async function getProducts() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const admin = await prisma.user.findFirst({
    where: { clerkId, role: "ADMIN" },
  });
  if (!admin) return null;

  return prisma.product.findMany({
    orderBy: { name: "asc" },
    include: {
      categories: true,
      rubriques: true,
      promotions: true,
    },
  });
}

export async function createProduct(formData: FormData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { error: "Non authentifié" };

  const admin = await prisma.user.findFirst({
    where: { clerkId, role: "ADMIN" },
  });
  if (!admin) return { error: "Accès refusé" };

  const name = (formData.get("name") as string)?.trim();
  const priceStr = (formData.get("price") as string)?.trim();
  const stockStr = (formData.get("stock") as string)?.trim();
  const categoryIds = formData.getAll("categoryIds") as string[];
  const rubriqueIds = formData.getAll("rubriqueIds") as string[];
  const promotionIds = formData.getAll("promotionIds") as string[];
  const description = (formData.get("description") as string)?.trim() || null;

  if (!name) return { error: "Le nom est requis" };
  const price = parseFloat(priceStr || "0");
  if (isNaN(price) || price < 0) return { error: "Le prix doit être positif" };
  const validCategoryIds = categoryIds.filter(Boolean);
  const validRubriqueIds = rubriqueIds.filter(Boolean);
  const validPromotionIds = promotionIds.filter(Boolean);
  if (validCategoryIds.length === 0)
    return { error: "Sélectionnez au moins une catégorie" };
  if (validRubriqueIds.length === 0)
    return { error: "Sélectionnez au moins une rubrique" };
  if (validPromotionIds.length === 0)
    return { error: "Sélectionnez au moins une promotion" };

  const slug = slugify(name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) return { error: "Un produit avec ce nom existe déjà" };

  const stock = parseInt(stockStr || "0", 10) || 0;

  let imageUrl: string | null = null;
  const imageFile = formData.get("image") as File | null;
  if (imageFile?.size && imageFile.size > 0) {
    imageUrl = await uploadProductImage(imageFile);
    if (!imageUrl) return { error: "Image invalide. Formats acceptés : JPEG, PNG, WebP, GIF (max 5 Mo)" };
  }

  // Parse related entities
  const parseRelated = (metaKey: string, imagePrefix: string) => {
    const meta = formData.get(metaKey) as string | null;
    const items = meta ? (JSON.parse(meta) as { name: string; title: string; description?: string }[]) : [];
    return items.map((item, i) => {
      const file = formData.get(`${imagePrefix}_${i}`) as File | null;
      return { ...item, _file: file };
    });
  };

  const cts = parseRelated("ct_meta", "ct_image");
  const fiches = parseRelated("ft_meta", "ft_image");
  const descriptions = parseRelated("dt_meta", "dt_image");

  const garantieMeta = formData.get("g_meta") as string | null;
  const garanties = garantieMeta
    ? (JSON.parse(garantieMeta) as { title: string; description: string; duree_garantie?: string }[])
    : [];

  const createProductWithRelated = async () => {
    const caracteristiqueIds: string[] = [];
    for (const ct of cts) {
      if (!ct.name.trim() || !ct.title.trim()) continue;
      let imgUrl: string | null = null;
      if (ct._file?.size && ct._file.size > 0) {
        imgUrl = await uploadProductImage(ct._file, "ct");
        if (!imgUrl) throw new Error("Image caractéristique technique invalide");
      }
      const rec = await prisma.caracteristiqueTechnique.create({
        data: { name: ct.name.trim(), title: ct.title.trim(), description: ct.description?.trim() || null, imageUrl: imgUrl },
      });
      caracteristiqueIds.push(rec.id);
    }

    const garantieIds: string[] = [];
    for (const g of garanties) {
      if (!g.title.trim() || !g.description.trim()) continue;
      const duree = g.duree_garantie?.trim();
      const dureeNum = duree ? parseInt(duree, 10) : null;
      const rec = await prisma.garantie.create({
        data: {
          title: g.title.trim(),
          description: g.description.trim(),
          duree_garantie: dureeNum != null && !isNaN(dureeNum) ? dureeNum : null,
        },
      });
      garantieIds.push(rec.id);
    }

    const ficheIds: string[] = [];
    for (const ft of fiches) {
      let imgUrl: string | null = null;
      if (ft._file?.size && ft._file.size > 0) {
        imgUrl = await uploadProductImage(ft._file, "fiche");
        if (!imgUrl) throw new Error("Image fiche technique invalide");
      }
      const rec = await prisma.ficheTechnique.create({
        data: { name: ft.name.trim(), title: ft.title.trim(), description: ft.description?.trim() || null, imageUrl: imgUrl },
      });
      ficheIds.push(rec.id);
    }

    const descriptionIds: string[] = [];
    for (const dt of descriptions) {
      let imgUrl: string | null = null;
      if (dt._file?.size && dt._file.size > 0) {
        imgUrl = await uploadProductImage(dt._file, "desc");
        if (!imgUrl) throw new Error("Image description technique invalide");
      }
      const rec = await prisma.descriptionTechnique.create({
        data: { name: dt.name.trim(), title: dt.title.trim(), description: dt.description?.trim() || null, imageUrl: imgUrl },
      });
      descriptionIds.push(rec.id);
    }

    await prisma.product.create({
      data: {
        name,
        slug,
        price,
        stock,
        description,
        imageUrl,
        categories: { connect: validCategoryIds.map((id) => ({ id })) },
        rubriques: { connect: validRubriqueIds.map((id) => ({ id })) },
        promotions: { connect: validPromotionIds.map((id) => ({ id })) },
        caracteristiqueTechnique: { connect: caracteristiqueIds.map((id) => ({ id })) },
        garanties: { connect: garantieIds.map((id) => ({ id })) },
        fichesTechniques: { connect: ficheIds.map((id) => ({ id })) },
        descriptionsTechniques: { connect: descriptionIds.map((id) => ({ id })) },
      },
    });
  };

  try {
    await createProductWithRelated();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur lors de la création" };
  }
  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { error: "Non authentifié" };

  const admin = await prisma.user.findFirst({
    where: { clerkId, role: "ADMIN" },
  });
  if (!admin) return { error: "Accès refusé" };

  const name = (formData.get("name") as string)?.trim();
  const priceStr = (formData.get("price") as string)?.trim();
  const stockStr = (formData.get("stock") as string)?.trim();
  const categoryIds = formData.getAll("categoryIds") as string[];
  const rubriqueIds = formData.getAll("rubriqueIds") as string[];
  const promotionIds = formData.getAll("promotionIds") as string[];
  const description = (formData.get("description") as string)?.trim() || null;

  if (!name) return { error: "Le nom est requis" };
  const price = parseFloat(priceStr || "0");
  if (isNaN(price) || price < 0) return { error: "Le prix doit être positif" };
  const validCategoryIds = categoryIds.filter(Boolean);
  const validRubriqueIds = rubriqueIds.filter(Boolean);
  const validPromotionIds = promotionIds.filter(Boolean);
  if (validCategoryIds.length === 0)
    return { error: "Sélectionnez au moins une catégorie" };
  if (validRubriqueIds.length === 0)
    return { error: "Sélectionnez au moins une rubrique" };
  if (validPromotionIds.length === 0)
    return { error: "Sélectionnez au moins une promotion" };

  const slug = slugify(name);
  const existing = await prisma.product.findFirst({
    where: { slug, NOT: { id } },
  });
  if (existing) return { error: "Un produit avec ce nom existe déjà" };

  const stock = parseInt(stockStr || "0", 10) || 0;

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      price,
      stock,
      description,
      categories: { set: validCategoryIds.map((id) => ({ id })) },
      rubriques: { set: validRubriqueIds.map((id) => ({ id })) },
      promotions: { set: validPromotionIds.map((id) => ({ id })) },
    },
  });
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { error: "Non authentifié" };

  const admin = await prisma.user.findFirst({
    where: { clerkId, role: "ADMIN" },
  });
  if (!admin) return { error: "Accès refusé" };

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  return { success: true };
}
