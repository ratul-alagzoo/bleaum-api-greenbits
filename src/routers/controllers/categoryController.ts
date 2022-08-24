import Category from "../../models/category";
import { nanoid } from "nanoid";

class CategoryController {
  constructor() {}

  public getAllCategories = async () => {
    let returnData = {};
    await Category.find()
      .then(async (res: any) => {
        // console.log(res);
        if (!res) {
          returnData = {
            Message: "Failure",
            data: "Error finding categoies",
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

  public updateCategory = async (categoryID: any, Body: any) => {
    let returnData = {};
    await Category.findOneAndUpdate({ categoryID: categoryID }, Body, {
      new: true,
    }).then(async (res: any) => {
      if (!res) {
        returnData = {
          Message: "Failure",
          data: "No Category found",
        };
      } else {
        returnData = {
          Message: "Success",
          data: res,
        };
      }
    });
    return await returnData;
  };
  public getAllCategoriesOutlet = async (outletId: any) => {
    let returnData: any = {};
    let categories: any = [];
    console.log(outletId);
    await Category.find(
      {},
      {
        countInventory: { $elemMatch: { outletChainID: outletId } },
        categoryID: 1,
        name: 1,
        slug: 1,
        parentCategory: 1,
        image: 1,
        status: 1,
      }
    )
      .then(async (res: any) => {
        // console.log(res);
        await res.map((obj: any) => {
          if (obj.countInventory.length) {
            categories.push(obj);
          }
        });
        if (!res) {
          returnData = {
            Message: "Failure",
            data: "Error finding categoies",
          };
        } else {
          console.log("e", categories);
          returnData = {
            Message: "Success",
            data: categories,
          };
        }
      })
      .catch((e) => console.log(e));

    return await returnData;
  };

  public searchByCategory = async (Name: any) => {
    let returnData = {};
    await Category.find({ name: { $regex: Name, $options: "i" } })
      .limit(5)
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "No Category found",
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

  public getPaginatedCategories = async (Page: any) => {
    let returnData = {};
    const resultsPerPage = 30;
    let page = Page >= 1 ? Page : 1;
    page = page - 1;
    await Category.find()
      .limit(resultsPerPage)
      .skip(resultsPerPage * page)
      .then(async (res: any) => {
        if (!res) {
          returnData = {
            Message: "Failure",
            data: "Error finding Category",
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

  public getSingleCategory = async (categoryID: any) => {
    let returnData = {};
    await Category.find({ categoryID: categoryID })
      .then(async (res: any) => {
        // console.log(res);
        if (res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "No Category Found",
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

  public addMultipleCategory = async (Body: any) => {
    let returnData = {};
    let sampleArray: any[] = [];
    let filtered = await Body.filter(
      (value: any, index: any, self: any) =>
        index === self.findIndex((t: any) => t.name === value.name)
    );
    console.log(filtered, "filtered categories", filtered.length);
    for (let i = 0; i < filtered.length; i++) {
      // console.log(filtered[i], `filtered${i}`);
      let response = await Category.findOneAndUpdate(
        { categoryID: filtered[i].categoryID },
        filtered[i],
        { new: true }
      );
      // console.log(response, 'response')
      //@ts-ignore
      if (!response || response?.length === 0) {
        sampleArray.push(filtered[i]);
      }
    }

    // console.log(sampleArray, 'sample Array categories');
    await Category.insertMany(sampleArray)
      .then(async (response) => {
        // console.log(response, 'response');
        if (!response || response.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Category is not created",
          };
        }
        returnData = {
          Message: "Category",
          data: response,
        };
      })
      .catch((err: any) => {
        console.log(err);
        returnData = {
          Message: "Failure",
          data: {
            Message: "Category name already exists | Server error",
            server: err,
          },
        };
      });
    return await returnData;
  };
}

export default CategoryController;
