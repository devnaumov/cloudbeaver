/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { injectable } from '@cloudbeaver/core-di';
import {
  GraphQLService,
  CachedMapResource,
  DriverInfo,
} from '@cloudbeaver/core-sdk';

export type DBDriver = Pick<
  DriverInfo,
  | 'id'
  | 'name'
  | 'icon'
  | 'description'
  | 'defaultPort'
  | 'sampleURL'
  | 'embedded'
  | 'anonymousAccess'
  | 'promotedScore'
  | 'defaultAuthModel'
>

@injectable()
export class DBDriverResource extends CachedMapResource<string, DBDriver> {

  constructor(private graphQLService: GraphQLService) {
    super(new Map());
  }

  async loadAll() {
    await this.load('all');
    return this.data;
  }

  protected async loader(key: string): Promise<Map<string, DBDriver>> {
    const { driverList } = await this.graphQLService.gql.driverList();

    this.data.clear();

    for (const driver of driverList) {
      this.data.set(driver.id, driver);
    }
    // this.data.set('all', {} as any);
    this.markUpdated(key);
    return this.data;
  }
}
