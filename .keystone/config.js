"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");
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
        delete: ({ session: session2, context, listKey, operation }) => {
          console.log({ session: session2 });
          return session2?.data.isAdmin;
        }
      }
    },
    ui: {
      hideDelete: ({ session: session2 }) => !session2?.data.isAdmin,
      listView: {
        initialColumns: ["name", "email", "isAdmin"]
      }
    },
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({ isIndexed: "unique", validation: { isRequired: true } }),
      password: (0, import_fields.password)({
        access: {
          update: ({ session: session2, item }) => session2 && (session2.data.isAdmin || session2.itemId === item.id)
        },
        ui: {
          itemView: {
            fieldMode: ({ session: session2, item }) => session2 && (session2.data.isAdmin || session2.itemId === item.id) ? "edit" : "hidden"
          },
          listView: {
            fieldMode: ({ session: session2 }) => session2?.item?.isAdmin ? "read" : "hidden"
          }
        }
      }),
      isAdmin: (0, import_fields.checkbox)({
        access: {
          create: ({ session: session2 }) => session2?.data.isAdmin,
          update: ({ session: session2 }) => session2?.data.isAdmin
        },
        ui: {
          createView: {
            fieldMode: ({ session: session2 }) => session2?.data.isAdmin ? "edit" : "hidden"
          },
          itemView: {
            fieldMode: ({ session: session2 }) => session2?.data.isAdmin ? "edit" : "read"
          }
        }
      })
    }
  })
};

// session/custom-session.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_crypto = require("crypto");
var MAX_AGE = 60 * 60 * 8;
var ALGORITHM = "HS256";
var SECRET = (0, import_crypto.randomBytes)(32).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 32);
function customizeStatelessSessions({
  secret,
  maxAge = MAX_AGE,
  secure = false
}) {
  if (!secret) {
    throw new Error("You must specify a session secret to use sessions");
  }
  return {
    async get(args) {
      const { req } = args;
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token)
        return;
      try {
        const data = import_jsonwebtoken.default.verify(token, secret, { maxAge });
        return data;
      } catch (error) {
        return;
      }
    },
    async end(args) {
      const { res } = args;
      res.setHeader("Authorization", "");
    },
    async start(args) {
      const { data, res } = args;
      try {
        const newToken = import_jsonwebtoken.default.sign({ ...Object(data) }, secret, {
          algorithm: ALGORITHM,
          expiresIn: maxAge
        });
        res.setHeader("Authorization", "Bearer " + newToken);
        return newToken;
      } catch (error) {
        return "";
      }
    }
  };
}
var session = customizeStatelessSessions({
  maxAge: MAX_AGE,
  secret: SECRET
});

// keystone.ts
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
    server: {
      cors: {
        origin: "*",
        credentials: true
      }
    },
    db: {
      provider: "sqlite",
      url: process.env.DATABASE_URL || "file:./keystone-example.db"
    },
    lists,
    ui: {},
    session
  })
);
