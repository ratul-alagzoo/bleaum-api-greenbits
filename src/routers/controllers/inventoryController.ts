import Inventory from "../../models/inventory";
import Product from "../../models/products";
import Category from "../../models/category";
import Deals from "../../models/deals";
import PopularTrending from "../../models/popularNtrending";
import CategoryController from "./categoryController";
import BrandController from "./brandController";
import ProductController from "./productController";
import dotenv from "dotenv";

class InventoryController {
  categoryController = new CategoryController();
  brandController = new BrandController();
  productController = new ProductController();

  constructor() {}

  public updateFromInventory = async (
    productID: any,
    outletChainID: any,
    Body: any
  ) => {
    let returnData = {};
    console.log("body", productID, outletChainID, Body);
    let product = await Product(process.env.DB_NAME as string).find({ productID: productID });
    await Inventory(process.env.DB_NAME as string).findOneAndUpdate(
      { productID: productID, outletChainID: outletChainID },
      Body,
      { new: true }
    )
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "No Inventory found",
          };
        } else {
          // for (let i = 0; i < product[0].category.length; i++) {
          //     if ("categoryID" in product[0].category[i]) {

          //         Category.find({ categoryID: product[0].category[i].categoryID, "countInventory.outletChainID": outletChainID }).then((cateRes) => {
          //             if (cateRes.length) {
          //             }
          //             else {
          //                 console.log('update one');
          //                 Category.updateOne(
          //                     { categoryID: product[0].category[i].categoryID },
          //                     { $addToSet: { "countInventory": { "count": 1, "outletChainID": outletChainID } } }
          //                 ).then(respond => {
          //                     console.log('category counter', respond);
          //                 })
          //             }
          //         })
          //     }
          // }
          // if ("brandID" in product[0]) {
          //     Brand.find({ brandID: product[0].brandID, "countInventory.outletChainID": Body.outletChainID }).then((brandRes) => {
          //         if (brandRes.length) {
          //         }
          //         else {
          //             console.log('update one');
          //             Brand.updateOne(
          //                 { brandID: product[0].brandID },
          //                 { $addToSet: { "countInventory": { "count": 1, "outletChainID": outletChainID } } }
          //             ).then(respond => {
          //                 console.log('brand counter', respond);
          //             })
          //         }
          //     })
          // }
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      })
      .catch((err: any) => console.log(err));

    return await returnData;
  };

  public getFeaturedInventory = async (outletChainID: any) => {
    let returnData = {};
    await Inventory(process.env.DB_NAME as string).find({
      outletChainID: outletChainID,
      featuredProduct: true,
    })
      .then(async (res: any) => {
        console.log(res);
        if (res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "No Featured Inventory Found",
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

  public getLowHighPrice = async (outletChainID: any, sort: any) => {
    let returnData = {};
    console.log(sort, "sort:");
    await Inventory(process.env.DB_NAME as string).find({ outletChainID: outletChainID })
      .sort(sort)
      .then(async (res: any) => {
        console.log(res);
        if (res.length === 0) {
          returnData = {
            Message: "Failure",
            data: [],
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

  public getAllOutletInventory = async (outletChainID: any) => {
    let returnData = {};
    await Inventory(process.env.DB_NAME as string).find({ outletChainID: outletChainID })
      .then(async (res: any) => {
        // console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Error finding inventory",
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

  public getAllPaginatedProducts = async (outletChainID: any, Page: any) => {
    let returnData = {};
    const resultsPerPage = 50;
    let page = Page >= 1 ? Page : 1;
    page = page - 1;

    await Inventory(process.env.DB_NAME as string).find({ outletChainID: outletChainID })
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
          data: "Error finding Inventory",
        };
      });
    return await returnData;
  };

  public searchInventory = async (outletChainID: any, name: any) => {
    let returnData = {};
    await Inventory(process.env.DB_NAME as string).find({
      outletChainID: outletChainID,
      "product.name": { $regex: name, $options: "i" },
    })
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Error finding inventory",
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

  public getInventoryByBrand = async (
    brandID: any,
    outletChainID: any,
    Page: any
  ) => {
    let returnData = {};
    const resultsPerPage = 30;
    let page = Page >= 1 ? Page : 1;
    page = page - 1;
    console.log(brandID, "brand ID");
    await Inventory(process.env.DB_NAME as string).find({ "product.brandID": brandID })
      .limit(resultsPerPage)
      .skip(resultsPerPage * page)
      .then(async (res: any) => {
        // console.log(res);
        if (res.length === 0) {
          returnData = {
            Message: "Failure",
            data: [],
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

  public getInventoryByDeal = async (
    dealId: any,
    outletChainID: any,
    Page: any
  ) => {
    let returnData = {};
    let allProducts: any[] = [];
    let allCategories: any[] = [];
    console.log(dealId, "deal ID");
    try {
      const deal = await Deals(process.env.DB_NAME as string).findOne({ dealId: dealId });
      if (deal) {
        console.log("deals solo", deal);
        if (deal.selectedProducts.length > 0) {
          for (let i = 0; i < deal.selectedProducts.length; i++) {
            const solo = await Inventory(process.env.DB_NAME as string).findOne({
              productID: deal.selectedProducts[i].productID,
            });
            allProducts.push(solo);
          }
        } else if (deal.selectedCategories.length > 0) {
          for (let i = 0; i < deal.selectedCategories.length; i++) {
            const solo = await Category(process.env.DB_NAME as string).findOne({
              categoryID: deal.selectedCategories[i].categoryID,
            });
            allCategories.push(solo);
          }
        }
      } else {
        returnData = {
          Message: "Failure",
          data: "No Data found",
        };
      }
      if (allProducts.length > 0) {
        returnData = {
          Message: "",
          data: allProducts,
        };
      } else if (allCategories.length > 0) {
        returnData = {
          Message: "",
          data: allCategories,
        };
      } else {
        console.log(allProducts, allCategories, "ALL");
        returnData = {
          Message: "Failure",
          data: "No Data found",
        };
      }
    } catch (error) {
      console.log(error);
    }
    return await returnData;
  };

  public getInventoryByCategory = async (
    categoryID: any,
    outletChainID: any,
    Page: any
  ) => {
    let returnData = {};
    const resultsPerPage = 30;
    let page = Page >= 1 ? Page : 1;
    page = page - 1;
    console.log(categoryID, "category ID", Page);
    await Inventory(process.env.DB_NAME as string).find({ "product.category.categoryID": categoryID })
      .limit(resultsPerPage)
      .skip(resultsPerPage * page)
      .then(async (res: any) => {
        console.log(res.length, "length check");
        if (res.length === 0) {
          returnData = {
            Message: "Failure",
            data: [],
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

  public getAllFilteredBrands = async (outletChainID: any, Body: any) => {
    let returnData = {};
    let ResponseData: any = [];

    for (let i = 0; i < Body.brandName.length; i++) {
      console.log(Body.brandName[i], "brandName");
      try {
        const find = await Inventory(process.env.DB_NAME as string).find({
          outletChainID: outletChainID,
          "product.brandName": Body.brandName[i],
        });
        console.log(find, "find");
        ResponseData.push(find);
        // returnData = {
        //     Message: "Success",
        //     data: ResponseData
        // }
      } catch (err) {
        console.log(err);
      }
    }

    var filtered = ResponseData.filter(function (el: any) {
      return el != null;
    });
    returnData = {
      Message: "Success",
      data: filtered,
    };
    return returnData;
  };

  public popularInventory = async () => {
    let returnData = {};
    let results: any[] = [];
    try {
      await PopularTrending(process.env.DB_NAME as string).aggregate([{ $sortByCount: "$Details.productID" }])
        .then(async (res: any) => {
          console.log(res);
          for (let i = 0; i < res.length; i++) {
            try {
              console.log(res[i]._id);
              const find = await Inventory(process.env.DB_NAME as string).findOne({ productID: res[i]._id });
              console.log(find, "find");
              if (find) {
                results.push(find);
              }
            } catch (err) {
              console.log(err);
            }
          }
          // console.log(results, 'results');

          // returnData = await {
          //     'Message': 'Success',
          //     'data': results
          // }
        })
        .catch((e) => console.log(e));
    } catch (e) {
      console.log(e);
    }
    returnData = await {
      Message: "Success",
      data: results,
    };
    return returnData;
  };

  public trendingInventory = async () => {
    let returnData = {};
    const date = +new Date() - 7 * 60 * 60 * 24 * 1000;
    let results: any[] = [];

    await PopularTrending(process.env.DB_NAME as string).find({
      timestamp: {
        $gte: new Date(date),
      },
    })
      .then(async (res) => {
        console.log(res, "trending");
        for (let i = 0; i < res.length; i++) {
          try {
            console.log(res[i]._id);
            const find = await Inventory(process.env.DB_NAME as string).findOne({ productID: res[i]._id });
            console.log(find, "find");
            if (find) {
              results.push(find);
            }
          } catch (err) {
            console.log(err);
          }
        }
      })
      .catch((e) => console.log(e));
    returnData = await {
      Message: "Success",
      data: results,
    };
    return await returnData;
  };

  public getFilterByTNC = async (outletChainID: any, Body: any) => {
    let returnData = {};
    console.log(Body.thc, "Body", Body.cbd);
    let cbdIni: number = Body.cbd ? Body.cbd[0] - 1 : 0;
    let cbdEnd: number = Body.cbd ? Body.cbd[1] + 1 : 0;
    let thcIni: number = Body.thc ? Body.thc[0] - 1 : 0;
    let thcEnd: number = Body.thc ? Body.thc[1] + 1 : 0;
    if (!Body.thc || Body.thc === 0) {
      console.log("cbd");
      await Inventory(process.env.DB_NAME as string).find({
        outletChainID: outletChainID,
        "product.cbd": { $lt: cbdEnd, $gt: cbdIni },
      })
        .then(async (res: any) => {
          console.log(res);
          if (!res || res.length === 0) {
            returnData = {
              Message: "Failure",
              data: [],
            };
          } else {
            returnData = {
              Message: "Success",
              data: res,
            };
          }
        })
        .catch((e) => console.log(e));
    } else if (!Body.cbd || Body.cbd === 0) {
      console.log("thc");
      await Inventory(process.env.DB_NAME as string).find({
        outletChainID: outletChainID,
        "product.thc": { $lt: thcEnd, $gt: thcIni },
      })
        .then(async (res: any) => {
          console.log(res);
          if (!res || res.length === 0) {
            returnData = {
              Message: "Failure",
              data: [],
            };
          } else {
            returnData = {
              Message: "Success",
              data: res,
            };
          }
        })
        .catch((e) => console.log(e));
    } else {
      console.log("both");
      await Inventory(process.env.DB_NAME as string).find({
        outletChainID: outletChainID,
        "product.thc": { $lt: thcEnd, $gt: thcIni },
        "product.cbd": { $lt: cbdEnd, $gt: cbdIni },
      })
        .then(async (res: any) => {
          console.log(res);
          if (!res || res.length === 0) {
            returnData = {
              Message: "Failure",
              data: [],
            };
          } else {
            returnData = {
              Message: "Success",
              data: res,
            };
          }
        })
        .catch((e) => console.log(e));
    }

    return await returnData;
  };

  public getFilteredAll = async (outletChainID: any, body: any) => {
    let returnData = {};
    let inventory: any = [];
    console.log(outletChainID, body);

    let allData: any = await this.getAllOutletInventory(outletChainID);
    console.log(allData, "All Data");
    if (allData.Message === "Failure") {
      await inventory.push(allData.data);
    } else {
      await inventory.push(...allData.data);
    }

    if (body.categoryIDs) {
      console.log("Categories");
      let allCategories = inventory.filter((o1: any) =>
        body.categoryIDs.some((o2: any) =>
          o1.product.category.some((cat3: any) => cat3.categoryID === o2)
        )
      );
      console.log(allCategories, "All Categories");
      inventory = await allCategories;
    }

    if (body.brandIDs) {
      console.log("Brands");
      let allBrands = inventory.filter((o1: any) =>
        body.brandIDs.some((o2: any) => o1.product.brandID === o2)
      );
      console.log(allBrands, "All Brands");
      inventory = await allBrands;
    }

    if (body.weight) {
      console.log("weight");
      let allWeight = inventory.filter((o1: any) =>
        o1.variants.some((cat3: any) => cat3.weight === body.weight)
      );
      console.log(allWeight, "All Weight");
      inventory = await allWeight;
    }

    if (body.price) {
      console.log("weight");
      let allPrice = inventory.filter((o1: any) =>
        o1.variants.some(
          (cat3: any) =>
            cat3.price >= body.price.min && cat3.price <= body.price.max
        )
      );
      console.log(allPrice, "All allPrice");
      inventory = await allPrice;
    }

    if (body.discount) {
      console.log("Discount");
      let Discounted = inventory.filter(
        (o1: any) => o1.discountPercentage >= body.discount
      );
      console.log(Discounted, "All Discounted");
      inventory = await Discounted;
    }

    if (body.search) {
      console.log("Search");
      let SearchedInventory = inventory.filter((search: any) =>
        search.product.name.toLowerCase().includes(body.search.toLowerCase())
      );
      console.log(SearchedInventory, "All Searched");
      inventory = await SearchedInventory;
    }

    if (body.cbd || body.thc) {
      console.log("CBD & THC");
      if (!body.thc || body.thc === 0) {
        let Cbd = inventory.filter(
          (o1: any) =>
            o1.product.cbd < body.cbd.max && o1.product.cbd > body.cbd.min
        );
        console.log(Cbd, "All Cbd");
        inventory = await Cbd;
      } else if (!body.cbd || body.cbd === 0) {
        let Thc = inventory.filter(
          (o1: any) =>
            o1.product.thc < body.thc.max && o1.product.thc > body.thc.min
        );
        console.log(Thc, "All Thc");
        inventory = await Thc;
      } else {
        let ThcCbd = inventory.filter(
          (o1: any) =>
            o1.product.thc < body.thc.max &&
            o1.product.thc > body.thc.min &&
            o1.product.cbd < body.cbd.max &&
            o1.product.cbd > body.cbd.min
        );
        console.log(ThcCbd, "All ThcCbd");
        inventory = await ThcCbd;
      }
    }

    if (body.dealIDs) {
      console.log("Deals");
      // let temp: any = [];
      // for(let i=0; i< body.dealIDs.length; i++){
      //     await Deals.find({dealId: body.dealIDs[i]}).then(async(res) => {
      //     console.log('deal response',res);
      //         if(res.length){
      //             await temp.push(res[0]);
      //         }
      //     })
      // }
      // console.log(temp, 'deals temp');
      let DealsInventory: any = await this.DealsIDsInventory(
        outletChainID,
        body.dealIDs
      );
      console.log(DealsInventory, "All Deals");
      inventory = await DealsInventory.data;
    }

    returnData = {
      Message: "Success",
      data: await inventory,
    };
    return await returnData;
  };

  public DealsIDsInventory = async (outletChainID: any, Body: any) => {
    let returnData = {};
    let CategoriesArray: any = [];
    let FinalData: any = [];

    for (let i = 0; i < Body.length; i++) {
      // console.log(Body.categoryIDs[i], 'categoryID');
      try {
        const find = await Deals(process.env.DB_NAME as string).find({
          dealId: Body[i],
        });
        // console.log(find, 'find');
        if (find[0].selectedCategories.length) {
          for (let j = 0; j < find[0].selectedCategories.length; j++) {
            CategoriesArray.push(find[0].selectedCategories[j].categoryID);
          }
        }
        // returnData = {
        //     Message: "Success",
        //     data: ResponseData
        // }
      } catch (err) {
        console.log(err);
      }
    }

    let replyCategoryID: any = await this.getAllCategoriesByIDS(outletChainID, {
      categoryIDs: CategoriesArray,
    });
    await FinalData.push(replyCategoryID.data);

    returnData = await {
      Message: "Success",
      data: FinalData[0],
    };

    return await returnData;
  };

  public getInventoryByID = async (ID: any) => {
    let returnData = {};
    // console.log(brandID, 'brand ID')
    await Inventory(process.env.DB_NAME as string).findOne({ productID: ID })
      .then(async (res: any) => {
        // console.log(res);
        if (res.length === 0) {
          returnData = {
            Message: "Failure",
            data: [],
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
  public getAllCategoriesByIDS = async (outletChainID: any, Body: any) => {
    let returnData = {};
    let ResponseData: any = [];

    for (let i = 0; i < Body.categoryIDs.length; i++) {
      // console.log(Body.categoryIDs[i], 'categoryID');
      try {
        const find = await Inventory(process.env.DB_NAME as string).find({
          outletChainID: outletChainID,
          "product.category.categoryID": Body.categoryIDs[i],
        });
        // console.log(find, 'find');
        ResponseData.push(...find);
        // returnData = {
        //     Message: "Success",
        //     data: ResponseData
        // }
      } catch (err) {
        console.log(err);
      }
    }

    var filtered = ResponseData.filter(function (el: any) {
      return el != null;
    });
    returnData = {
      Message: "Success",
      data: filtered,
    };
    return returnData;
  };
}

export default InventoryController;
