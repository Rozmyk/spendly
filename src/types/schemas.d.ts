/**
 * The contents of this file were created automatically by `npm run generate:schema` with the help of
 * json-schema-to-typescript. Do not make any manual modifications to this file. Instead, update the source JSON Schema
 * files and rerun `npm run generate:schema` to regenerate the contents of this file.
 *
 * @cli npm run generate:schema
 */

declare namespace Api {
  namespace Schemas {
    namespace Core {
      namespace Root {
        /**
         * No Content.
         */
        type Response204 = null;
      }
    }
    namespace Expenses {
      namespace Create {
        interface Body {
          amount: number;
          description: string;
          categoryId: number;
        }
        /**
         * Created expense.
         */
        interface Response201 {
          id: number;
          amount: number;
          description: string;
          categoryId: number;
          createdAt: string;
        }
        type Request = { Body: Api.Schemas.Expenses.Create.Body };
      }
      namespace List {
        /**
         * Saved expenses.
         */
        type Response200 = {
          id: number;
          amount: number;
          description: string;
          categoryId: number;
          createdAt: string;
        }[];
      }
    }
    namespace Users {
      namespace Create {
        interface Body {
          email: string;
          name: string;
        }
        /**
         * OK.
         */
        interface Response201 {
          id?: string;
          email?: string;
          name?: string;
          createdAt?: string;
          updatedAt?: string;
        }
        /**
         * Email address already exists.
         */
        interface Response409 {
          statusCode?: number;
          error?: string;
          message?: string;
        }
        type Request = { Body: Api.Schemas.Users.Create.Body };
      }
    }
  }
}
