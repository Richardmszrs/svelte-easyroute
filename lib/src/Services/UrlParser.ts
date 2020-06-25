import QueryString from 'query-string'
import {Route} from "../Router/types";

export default class UrlParser {
    private static getQueryParams(queryString: string) {
        return QueryString.parse(queryString)
    }

    private static getPathParams(matchedRoute: Route, url: string) {
        let pathValues: string[] = matchedRoute.regexpPath!.exec(url) as string[]
        pathValues = pathValues.slice(1, pathValues.length);
        let urlParams : { [key : string] : string} = {};
        for (let pathPart in pathValues) {
            let value = pathValues[pathPart];
            let key = matchedRoute.pathKeys![pathPart].name;
            if (typeof key !== "number") urlParams[key] = value;
        }
        return urlParams;
    }

    public static createRouteObject(matchedRoutes: Route[], url: string) {
        const depths: number[] = matchedRoutes.map(route => route.nestingDepth as number)
        const maxDepth = Math.max(...depths)
        const currentMatched = matchedRoutes.find(route => route.nestingDepth === maxDepth)
        const [pathString, queryString]: string[] = url.split('?')
        if (currentMatched) {
            const pathParams = UrlParser.getPathParams(currentMatched, pathString)
            const queryParams = UrlParser.getQueryParams(queryString)
            return {
                params: pathParams,
                query: queryParams,
                name: currentMatched.name,
                fullPath: url
            }
        }
        return {
            params: {},
            query: {},
            name: null,
            url: null
        }
    }
}