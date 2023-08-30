export const roles = [
    { name: 'Admin', description: 'Administrator role with full access.' },
    { name: 'User', description: 'Regular user role with basic access.' },
    { name: 'Manager', description: 'Manager role with elevated permissions.' },
    { name: 'Employee', description: 'Employee role with specific access.' },
] as const

type ArrayToUnion<T> = T extends ReadonlyArray<infer U> ? U : never
export type ROLE_TYPE = ArrayToUnion<(typeof roles)[number]['name']>
