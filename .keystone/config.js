"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");
var import_session = require("@keystone-6/core/session");
var import_auth = require("@keystone-6/auth");

// schema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var lists = {
  User: (0, import_core.list)({
    access: {
      operation: {
        ...(0, import_access.allOperations)(import_access.allowAll),
        delete: ({ session }) => session?.data.isAdmin
      }
    },
    ui: {
      hideDelete: ({ session }) => !session?.data.isAdmin,
      listView: {
        initialColumns: ["name", "email", "isAdmin"]
      }
    },
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({ isIndexed: "unique", validation: { isRequired: true } }),
      password: (0, import_fields.password)({
        access: {
          update: ({ session, item }) => session && (session.data.isAdmin || session.itemId === item.id)
        },
        ui: {
          itemView: {
            fieldMode: ({ session, item }) => session && (session.data.isAdmin || session.itemId === item.id) ? "edit" : "hidden"
          },
          listView: {
            fieldMode: ({ session }) => session?.item?.isAdmin ? "read" : "hidden"
          }
        }
      }),
      isAdmin: (0, import_fields.checkbox)({
        access: {
          create: ({ session }) => session?.data.isAdmin,
          update: ({ session }) => session?.data.isAdmin
        },
        ui: {
          createView: {
            fieldMode: ({ session }) => session?.data.isAdmin ? "edit" : "hidden"
          },
          itemView: {
            fieldMode: ({ session }) => session?.data.isAdmin ? "edit" : "read"
          }
        }
      })
    }
  })
};

// keystone.ts
var sessionSecret = "-- DEV COOKIE SECRET; CHANGE ME --";
var sessionMaxAge = 60 * 60 * 24 * 30;
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"],
    itemData: {
      isAdmin: true
    }
  },
  sessionData: "name isAdmin"
});
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      provider: "sqlite",
      url: process.env.DATABASE_URL || "file:./keystone-example.db"
    },
    lists,
    ui: {},
    session: (0, import_session.statelessSessions)({
      maxAge: sessionMaxAge,
      secret: sessionSecret
    })
  })
);
