import { Optional } from "@/src/infra/http/types/optional";
import { Entity } from "@/src/infra/shared/entities/Entity";
import { dateModule } from "@/src/models/date/DateModule";

interface MapLikeProps {
  map_id: string;
  member_id: string;
  created_at: Date;
}

export type CreateMapLikeProps = Optional<MapLikeProps, "created_at">;

export class MapLike extends Entity<MapLikeProps> {
  static create(props: CreateMapLikeProps, id?: string) {
    const mapLikeProps: MapLikeProps = {
      ...props,
      created_at: props.created_at ?? dateModule.Date.nowUtcDate(),
    };

    const newMapLike = new MapLike(mapLikeProps, id);

    return newMapLike;
  }

  get map_id() {
    return this.props.map_id;
  }

  get member_id() {
    return this.props.member_id;
  }

  get created_at() {
    return this.props.created_at;
  }
}
