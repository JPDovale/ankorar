import { Prisma } from "@/src/infra/database/prisma/client";
import { db } from "@/src/infra/database/pool";
import { Module } from "@/src/infra/shared/entities/Module";
import { CreateMapProps, JsonValue, Map } from "./Map";
import { MapNotFound } from "@/src/infra/errors/MapNotFound";

interface MapModuleProps {
  name: string;
  Maps: {
    create: (props: CreateMapProps) => Promise<{ map: Map }>;
    updateNodeContent: (props: {
      id: string;
      memberId: string;
      content: JsonValue[];
    }) => Promise<{ map: Map }>;
    delete: (props: { id: string; memberId: string }) => Promise<{ map: Map }>;
    fns: {
      findById: (props: { id: string }) => Promise<{ map: Map }>;
      findByIdAndMemberId: (props: {
        id: string;
        memberId: string;
      }) => Promise<{ map: Map }>;
      findByMemberId: (props: { memberId: string }) => Promise<{ maps: Map[] }>;
      createCentralNode: (title: string) => JsonValue;
      extractCentralNodeTitle: (content: JsonValue[]) => string | null;
      persist: (props: { map: Map }) => Promise<{ map: Map }>;
    };
  };
}

class MapModule extends Module<MapModuleProps> {
  static create(props: MapModuleProps) {
    return new MapModule(props, props.name);
  }

  get Maps() {
    return this.props.Maps;
  }
}

export const mapModule = MapModule.create({
  name: "map",
  Maps: {
    async create(props) {
      const map = Map.create(props);

      if (!props.content || props.content.length === 0) {
        map.content = [this.fns.createCentralNode(map.title)];
      }

      await this.fns.persist({ map });

      return { map };
    },

    async updateNodeContent({ id, memberId, content }) {
      const { map } = await this.fns.findByIdAndMemberId({
        id,
        memberId,
      });

      map.content = content;
      const centralNodeTitle = this.fns.extractCentralNodeTitle(content);

      if (centralNodeTitle) {
        map.title = centralNodeTitle;
      }

      await this.fns.persist({ map });

      return { map };
    },

    async delete({ id, memberId }) {
      const { map } = await this.fns.findByIdAndMemberId({
        id,
        memberId,
      });

      map.markAsDeleted();

      await this.fns.persist({ map });

      return { map };
    },

    fns: {
      createCentralNode(title) {
        return {
          id: "1",
          pos: {
            x: 0,
            y: 0,
          },
          text: title,
          type: "central",
          style: {
            h: 68,
            w: 308,
            color: "#0f172a",
            isBold: true,
            padding: {
              x: 96,
              y: 32,
            },
            fontSize: 24,
            isItalic: false,
            textAlign: "left",
            textColor: "#0f172a",
            wrapperPadding: 4,
            backgroundColor: "#ffffff",
          },
          sequence: 0,
          childrens: [],
          isVisible: true,
          parent: null,
        };
      },

      extractCentralNodeTitle(content) {
        const centralNode = content.find((node) => {
          if (typeof node !== "object" || node === null) {
            return false;
          }

          return (node as { type?: unknown }).type === "central";
        });

        if (!centralNode || typeof centralNode !== "object") {
          return null;
        }

        const text = (centralNode as { text?: unknown }).text;

        if (typeof text !== "string") {
          return null;
        }

        const normalizedTitle = text.trim();

        if (!normalizedTitle) {
          return null;
        }

        return normalizedTitle;
      },

      async findById({ id }) {
        const mapOnDb = await db.map.findFirst({
          where: {
            id,
            deleted_at: null,
          },
        });

        if (!mapOnDb) {
          throw new MapNotFound();
        }

        const map = Map.create(
          {
            member_id: mapOnDb.member_id,
            title: mapOnDb.title,
            content: mapOnDb.content as JsonValue[],
            created_at: mapOnDb.created_at,
            updated_at: mapOnDb.updated_at,
            deleted_at: mapOnDb.deleted_at,
          },
          mapOnDb.id,
        );

        return { map };
      },

      async findByIdAndMemberId({ id, memberId }) {
        const mapOnDb = await db.map.findFirst({
          where: {
            id,
            member_id: memberId,
            deleted_at: null,
          },
        });

        if (!mapOnDb) {
          throw new MapNotFound();
        }

        const map = Map.create(
          {
            member_id: mapOnDb.member_id,
            title: mapOnDb.title,
            content: mapOnDb.content as JsonValue[],
            created_at: mapOnDb.created_at,
            updated_at: mapOnDb.updated_at,
            deleted_at: mapOnDb.deleted_at,
          },
          mapOnDb.id,
        );

        return { map };
      },

      async findByMemberId({ memberId }) {
        const mapsOnDb = await db.map.findMany({
          where: {
            member_id: memberId,
            deleted_at: null,
          },
          orderBy: {
            created_at: "desc",
          },
        });

        const maps = mapsOnDb.map((mapOnDb) =>
          Map.create(
            {
              member_id: mapOnDb.member_id,
              title: mapOnDb.title,
              content: mapOnDb.content as JsonValue[],
              created_at: mapOnDb.created_at,
              updated_at: mapOnDb.updated_at,
              deleted_at: mapOnDb.deleted_at,
            },
            mapOnDb.id,
          ),
        );

        return { maps };
      },

      async persist({ map }) {
        function mapToDbModel(map: Map) {
          return {
            id: map.id,
            member_id: map.member_id,
            title: map.title,
            content: map.content as Prisma.InputJsonValue,
            created_at: map.created_at,
            updated_at: map.updated_at,
            deleted_at: map.deleted_at,
          };
        }

        if (map.isNewEntity) {
          await db.map.create({
            data: mapToDbModel(map),
          });
        }

        if (map.isUpdatedRecently) {
          await db.map.update({
            where: {
              id: map.id,
            },
            data: mapToDbModel(map),
          });
        }

        map.forceNotNew();

        return { map };
      },
    },
  },
});
