import Product from "../../models/products";
import Inventory from "../../models/inventory";
import { nanoid } from "nanoid";
import mongoose from "mongoose";

class ProductController {
  constructor() {}

  public getAllProducts = async () => {
    let returnData = {};
    await Product(process.env.DB_NAME as string).find({ missing: false })
      .then(async (res: any) => {
        // console.log(res);
        if (!res) {
          returnData = {
            Message: "Failure",
            data: "Error finding products",
          };
        } else {
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      })
      .catch((e) => console.log(e));
    return await returnData;
  };

  public getAllSelectedProducts = async (Page: any) => {
    let returnData = {};
    const resultsPerPage = 50;
    let page = Page >= 1 ? Page : 1;
    page = page - 1;

    await Product(process.env.DB_NAME as string).find({ missing: false })
      .limit(resultsPerPage)
      .skip(resultsPerPage * page)
      .then(async (results) => {
        // console.log(results)
        returnData = await {
          Message: "Success",
          data: results,
        };
      })
      .catch(async (err) => {
        returnData = await {
          Message: "Failure",
          data: "Error finding Brand",
        };
      });
    return await returnData;
  };

  public getMissingProduct = async () => {
    let returnData = {};
    await Product(process.env.DB_NAME as string).find({ missing: true })
      .then(async (res: any) => {
        // console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Error finding products",
          };
        } else {
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      })
      .catch((e) => console.log(e));
    return await returnData;
  };

  public addMissingProduct = async (Body: any) => {
    let returnData = {};
    console.log(Body);
    let product = new (Product(process.env.DB_NAME as string))({
      productID: nanoid(),
      name: Body.name,
      slug: Body.slug,
      cbd: Body.cbd,
      thc: Body.thc,
      shortDescription: Body.shortDescription,
      longDescription: Body.longDescription,
      image: Body.image,
      imageGallery: Body.imageGallery,
      brandID: Body.brandID,
      brandName: Body.brandName,
      category: Body.category,
      height: Body.height,
      width: Body.width,
      weight: Body.weight,
      status: Body.status,
      effects: Body.effects,
      missing: true,
    });

    await product
      .save()
      .then(async (response: any) => {
        if (!response || response.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Product is not created",
          };
        } else {
          returnData = await {
            Message: "Success",
            data: response,
          };
        }
      })
      .catch((err: any) => {
        console.log(err);
        returnData = {
          Message: "Failure",
          data: err,
        };
      });

    return await returnData;
  };

  public searchByProduct = async (Name: any) => {
    let returnData = {};
    await Product(process.env.DB_NAME as string).find({ name: { $regex: Name, $options: "i" } })
      .limit(5)
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "No Product found",
          };
        } else {
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      })
      .catch((e) => console.log(e));
    return await returnData;
  };

  public getProductByCategory = async (categoryID: any) => {
    let returnData = {};
    console.log(categoryID, "category ID");
    await Inventory(process.env.DB_NAME as string).find({ "product.category.categoryID": categoryID })
      .then(async (res: any) => {
        console.log(res);
        if (res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "No Product Found in this Category",
          };
        } else {
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      })
      .catch((e) => console.log(e));
    return await returnData;
  };

  public getProductByBrand = async (brandID: any) => {
    let returnData = {};
    console.log(brandID, "brand ID");
    await Inventory(process.env.DB_NAME as string).find({ "product.brandID": brandID })
      .then(async (res: any) => {
        // console.log(res);
        if (res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "No Product Found for this Brand",
          };
        } else {
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      })
      .catch((e) => console.log(e));
    return await returnData;
  };

  public addMultipleInventoryV1 = async (products: any[]) => {
    try {
      //get all products
      const productsKeyMap: Record<string, any> = products.reduce(
        (acc, el) => ({ ...acc, [el.productID as string]: true }),
        {}
      );
      console.log("Backing up status of the products...");
      const existingProducts = await Inventory(process.env.DB_NAME as string).find({
        outletChainID: process.env.OUTLET_CHAIN_ID,
      }).lean();
      let featuredList: Record<string, boolean> = existingProducts.reduce(
        (acc, el) => ({
          ...acc,
          [el.productID as string]: !!el.featuredProduct,
        }),
        {}
      );
      const productsToDelete: Record<string, boolean> = Object.keys(
        featuredList
      ).reduce((acc, el) => {
        if (productsKeyMap[el]) {
          return { ...acc };
        }
        return { ...acc, [el]: true };
      }, {});
      console.log("Products to delete: ", productsToDelete);
      //deleting products where updated stock is 0
      console.log("Deleting products...");
      let productsToDeleteKeys = Object.keys(productsToDelete);
      for (let i = 0; i < productsToDeleteKeys.length; i++) {
        let key = productsToDeleteKeys[i];
        try {
          await Inventory(process.env.DB_NAME as string).findOneAndRemove({
            productID: key,
            outletChainID: process.env.OUTLET_CHAIN_ID,
          });
        } catch (e) {
          console.error("Error in deletion ", e);
        }
      }

      //update db
      console.log("Inserting products....");
      for (let i = 0; i < products.length; i++) {
        const obj = products[i];
        console.log(i + 1);
        try {
          await Inventory(process.env.DB_NAME as string).findOneAndUpdate(
            {
              productID: obj.productID,
              outletChainID: process.env.OUTLET_CHAIN_ID,
            },
            {
              $set: {
                ...obj,
                featuredProduct: featuredList[obj.productID],
                outletChainID: process.env.OUTLET_CHAIN_ID,
              },
            },
            {
              upsert: true,
              new: true,
            }
          );
        } catch (e) {
          console.error("Error in upsert", e);
        }
      }
    } catch (e) {
      console.error("Inventory update error happenned: ", e);
    }
  };
  public addMultipleInventory = async (Body: any) => {
    let returnData = {};
    let sampleArray = [];

    for (let i = 0; i < Body.length; i++) {
      let response = await Inventory(process.env.DB_NAME as string).findOneAndUpdate(
        { productID: Body[i].productID },
        Body[i],
        { new: true }
      );
      console.log(response, "response update", i);
      returnData = await {
        Message: "Failure",
        data: `${response} ${i}`,
      };
      //@ts-ignore
      if (!response || response?.length === 0) {
        //@ts-ignore
        sampleArray.push(Body[i]);
      }
    }
    // console.log(sampleArray, 'sample array products');
    await Inventory(process.env.DB_NAME as string).insertMany(sampleArray)
      .then(async (response) => {
        // console.log(response, 'response');
        if (!response || response.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Inventory is not created",
          };
        }
        returnData = {
          Message: "Success",
          data: response,
        };
      })
      .catch((err: any) => {
        console.log(err);
        returnData = {
          Message: "Failure",
          data: {
            Message: "Inventory name already exists | Server error",
            server: err,
          },
        };
      });
    // console.log(returnData);
    Inventory(process.env.DB_NAME as string).remove({ variants: { $exists: false } });

    return await returnData;
  };
}

export default ProductController;
