import { Resolver } from 'awilix';
import { PubSub } from 'apollo-server-koa';
import { EnvService } from './services/env.service';
import { CryptoService } from './services/crypto.service';
import { DBService } from './services/db.service';
import { SettingsService } from './services/settings.service';
import { MemLogTransport } from './resolvers/memlogtransport';
import { MemberResolver, MemberByEmailResolver, MembersResolver, AddMemberResolver, UpdateMemberResolver } from './resolvers/member.resolver';
import { WebLoggingEnabledResolver, SetWebLoggingEnabledResolver, WebLogsResolver, AddWebLogResolver } from './resolvers/weblog.resolver';
import { SettingResolver, SettingsResolver, SetSettingResolver } from './resolvers/setting.resolver';
import { LoginResolver } from './resolvers/auth.resolver';
import { AppServer } from './server';

export interface ServiceModules {
    envService?: Resolver<EnvService>;
    cryptoService?: Resolver<CryptoService>;
    dbService?: Resolver<DBService>;
    webLogTransport?: Resolver<MemLogTransport>;
    settingsService?: Resolver<SettingsService>;
}

export interface ResolverModules {

    // auth
    loginResolver?: Resolver<LoginResolver>;
    
    // member
    memberResolver?: Resolver<MemberResolver>;
    memberByEmailResolver?: Resolver<MemberByEmailResolver>;
    membersResolver?: Resolver<MembersResolver>;
    addMemberResolver?: Resolver<AddMemberResolver>;
    updateMemberResolver?: Resolver<UpdateMemberResolver>;

    // weblog
    webLoggingEnabledResolver?: Resolver<WebLoggingEnabledResolver>;
    setWebLoggingEnabledResolver?: Resolver<SetWebLoggingEnabledResolver>;
    webLogsResolver?: Resolver<WebLogsResolver>;
    addWebLogResolver?: Resolver<AddWebLogResolver>;

    // setting
    settingResolver?: Resolver<SettingResolver>;
    settingsResolver?: Resolver<SettingsResolver>;
    setSettingResolver?: Resolver<SetSettingResolver>;
    
    appServer?: Resolver<AppServer>;
}

export interface ValueModules {
    pubSub?: Resolver<PubSub>;
}

export type MainContainerModules = ServiceModules & ResolverModules & ValueModules;

export type DBServiceClient = { dbService: DBService };
export type EnvServiceClient = { envService: EnvService };
export type SettingsServiceClient = { settingsService: SettingsService };
export type PubSubValueClient = { pubSub: PubSub };
