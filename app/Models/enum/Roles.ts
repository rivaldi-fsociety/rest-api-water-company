// enum Roles {
//     superadmin = 1,
//     user = 2,
//     surveyor = 3,
//     maintenance = 4,
//     customer_service = 5,
//     engineering = 6
// }
declare module '@ioc:Adonis/Addons/Rbac' {
    interface Roles {
        superadmin: {
            value:1
        }
        user: {
            value:2
        }
        surveyor: {
            value:3
        }
        maintenance: {
            value:4
        }
        customer_service: {
            value:5
        }
        engineering: {
            value:6
        }
    }
}