/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    export class AreaView extends ViewBase {

        private static areaInfo = [
            { "areacode": "86", "codename": "CN" },
            { "areacode": "376", "codename": "AD" },
            { "areacode": "971", "codename": "AE" },
            { "areacode": "93", "codename": "AF" },
            { "areacode": "1268", "codename": "AG" },
            { "areacode": "1264", "codename": "AI" },
            { "areacode": "355", "codename": "AL" },
            { "areacode": "374", "codename": "AM" },
            { "areacode": "244", "codename": "AO" },
            { "areacode": "54", "codename": "AR" },
            { "areacode": "1684", "codename": "AS" },
            { "areacode": "43", "codename": "AT" },
            { "areacode": "61", "codename": "AU" },
            { "areacode": "297", "codename": "AW" },
            { "areacode": "994", "codename": "AZ" },
            { "areacode": "387", "codename": "BA" },
            { "areacode": "1246", "codename": "BB" },
            { "areacode": "880", "codename": "BD" },
            { "areacode": "32", "codename": "BE" },
            { "areacode": "226", "codename": "BF" },
            { "areacode": "359", "codename": "BG" },
            { "areacode": "973", "codename": "BH" },
            { "areacode": "257", "codename": "BI" },
            { "areacode": "229", "codename": "BJ" },
            { "areacode": "1441", "codename": "BM" },
            { "areacode": "673", "codename": "BN" },
            { "areacode": "591", "codename": "BO" },
            { "areacode": "599", "codename": "BQ" },
            { "areacode": "55", "codename": "BR" },
            { "areacode": "1242", "codename": "BS" },
            { "areacode": "975", "codename": "BT" },
            { "areacode": "267", "codename": "BW" },
            { "areacode": "375", "codename": "BY" },
            { "areacode": "501", "codename": "BZ" },
            { "areacode": "1", "codename": "CA" },
            { "areacode": "243", "codename": "CD" },
            { "areacode": "236", "codename": "CF" },
            { "areacode": "242", "codename": "CG" },
            { "areacode": "41", "codename": "CH" },
            { "areacode": "225", "codename": "CI" },
            { "areacode": "682", "codename": "CK" },
            { "areacode": "56", "codename": "CL" },
            { "areacode": "237", "codename": "CM" },
            { "areacode": "57", "codename": "CO" },
            { "areacode": "506", "codename": "CR" },
            { "areacode": "53", "codename": "CU" },
            { "areacode": "238", "codename": "CV" },
            { "areacode": "599", "codename": "CW" },
            { "areacode": "357", "codename": "CY" },
            { "areacode": "420", "codename": "CZ" },
            { "areacode": "49", "codename": "DE" },
            { "areacode": "253", "codename": "DJ" },
            { "areacode": "45", "codename": "DK" },
            { "areacode": "1767", "codename": "DM" },
            { "areacode": "1809", "codename": "DO" },
            { "areacode": "213", "codename": "DZ" },
            { "areacode": "593", "codename": "EC" },
            { "areacode": "372", "codename": "EE" },
            { "areacode": "20", "codename": "EG" },
            { "areacode": "291", "codename": "ER" },
            { "areacode": "34", "codename": "ES" },
            { "areacode": "251", "codename": "ET" },
            { "areacode": "358", "codename": "FI" },
            { "areacode": "679", "codename": "FJ" },
            { "areacode": "691", "codename": "FM" },
            { "areacode": "298", "codename": "FO" },
            { "areacode": "33", "codename": "FR" },
            { "areacode": "241", "codename": "GA" },
            { "areacode": "44", "codename": "GB" },
            { "areacode": "1473", "codename": "GD" },
            { "areacode": "995", "codename": "GE" },
            { "areacode": "594", "codename": "GF" },
            { "areacode": "233", "codename": "GH" },
            { "areacode": "350", "codename": "GI" },
            { "areacode": "299", "codename": "GL" },
            { "areacode": "220", "codename": "GM" },
            { "areacode": "224", "codename": "GN" },
            { "areacode": "590", "codename": "GP" },
            { "areacode": "240", "codename": "GQ" },
            { "areacode": "30", "codename": "GR" },
            { "areacode": "502", "codename": "GT" },
            { "areacode": "1671", "codename": "GU" },
            { "areacode": "245", "codename": "GW" },
            { "areacode": "592", "codename": "GY" },
            { "areacode": "852", "codename": "HK" },
            { "areacode": "504", "codename": "HN" },
            { "areacode": "385", "codename": "HR" },
            { "areacode": "509", "codename": "HT" },
            { "areacode": "36", "codename": "HU" },
            { "areacode": "62", "codename": "ID" },
            { "areacode": "353", "codename": "IE" },
            { "areacode": "972", "codename": "IL" },
            { "areacode": "91", "codename": "IN" },
            { "areacode": "964", "codename": "IQ" },
            { "areacode": "98", "codename": "IR" },
            { "areacode": "354", "codename": "IS" },
            { "areacode": "39", "codename": "IT" },
            { "areacode": "1876", "codename": "JM" },
            { "areacode": "962", "codename": "JO" },
            { "areacode": "81", "codename": "JP" },
            { "areacode": "254", "codename": "KE" },
            { "areacode": "996", "codename": "KG" },
            { "areacode": "855", "codename": "KH" },
            { "areacode": "686", "codename": "KI" },
            { "areacode": "269", "codename": "KM" },
            { "areacode": "1869", "codename": "KN" },
            { "areacode": "850", "codename": "KP" },
            { "areacode": "82", "codename": "KR" },
            { "areacode": "965", "codename": "KW" },
            { "areacode": "1345", "codename": "KY" },
            { "areacode": "7", "codename": "KZ" },
            { "areacode": "856", "codename": "LA" },
            { "areacode": "961", "codename": "LB" },
            { "areacode": "1758", "codename": "LC" },
            { "areacode": "423", "codename": "LI" },
            { "areacode": "94", "codename": "LK" },
            { "areacode": "231", "codename": "LR" },
            { "areacode": "266", "codename": "LS" },
            { "areacode": "370", "codename": "LT" },
            { "areacode": "352", "codename": "LU" },
            { "areacode": "371", "codename": "LV" },
            { "areacode": "218", "codename": "LY" },
            { "areacode": "212", "codename": "MA" },
            { "areacode": "377", "codename": "MC" },
            { "areacode": "373", "codename": "MD" },
            { "areacode": "382", "codename": "ME" },
            { "areacode": "261", "codename": "MG" },
            { "areacode": "692", "codename": "MH" },
            { "areacode": "389", "codename": "MK" },
            { "areacode": "223", "codename": "ML" },
            { "areacode": "95", "codename": "MM" },
            { "areacode": "976", "codename": "MN" },
            { "areacode": "853", "codename": "MO" },
            { "areacode": "222", "codename": "MR" },
            { "areacode": "1664", "codename": "MS" },
            { "areacode": "356", "codename": "MT" },
            { "areacode": "230", "codename": "MU" },
            { "areacode": "960", "codename": "MV" },
            { "areacode": "265", "codename": "MW" },
            { "areacode": "52", "codename": "MX" },
            { "areacode": "60", "codename": "MY" },
            { "areacode": "258", "codename": "MZ" },
            { "areacode": "264", "codename": "NA" },
            { "areacode": "687", "codename": "NC" },
            { "areacode": "227", "codename": "NE" },
            { "areacode": "234", "codename": "NG" },
            { "areacode": "505", "codename": "NI" },
            { "areacode": "31", "codename": "NL" },
            { "areacode": "47", "codename": "NO" },
            { "areacode": "977", "codename": "NP" },
            { "areacode": "674", "codename": "NR" },
            { "areacode": "64", "codename": "NZ" },
            { "areacode": "968", "codename": "OM" },
            { "areacode": "507", "codename": "PA" },
            { "areacode": "51", "codename": "PE" },
            { "areacode": "689", "codename": "PF" },
            { "areacode": "675", "codename": "PG" },
            { "areacode": "63", "codename": "PH" },
            { "areacode": "92", "codename": "PK" },
            { "areacode": "48", "codename": "PL" },
            { "areacode": "508", "codename": "PM" },
            { "areacode": "1787", "codename": "PR" },
            { "areacode": "351", "codename": "PT" },
            { "areacode": "680", "codename": "PW" },
            { "areacode": "595", "codename": "PY" },
            { "areacode": "974", "codename": "QA" },
            { "areacode": "262", "codename": "RE" },
            { "areacode": "40", "codename": "RO" },
            { "areacode": "381", "codename": "RS" },
            { "areacode": "7", "codename": "RU" },
            { "areacode": "250", "codename": "RW" },
            { "areacode": "966", "codename": "SA" },
            { "areacode": "677", "codename": "SB" },
            { "areacode": "248", "codename": "SC" },
            { "areacode": "249", "codename": "SD" },
            { "areacode": "46", "codename": "SE" },
            { "areacode": "65", "codename": "SG" },
            { "areacode": "386", "codename": "SI" },
            { "areacode": "421", "codename": "SK" },
            { "areacode": "232", "codename": "SL" },
            { "areacode": "378", "codename": "SM" },
            { "areacode": "221", "codename": "SN" },
            { "areacode": "252", "codename": "SO" },
            { "areacode": "597", "codename": "SR" },
            { "areacode": "239", "codename": "ST" },
            { "areacode": "503", "codename": "SV" },
            { "areacode": "963", "codename": "SY" },
            { "areacode": "268", "codename": "SZ" },
            { "areacode": "1649", "codename": "TC" },
            { "areacode": "235", "codename": "TD" },
            { "areacode": "228", "codename": "TG" },
            { "areacode": "66", "codename": "TH" },
            { "areacode": "992", "codename": "TJ" },
            { "areacode": "670", "codename": "TL" },
            { "areacode": "993", "codename": "TM" },
            { "areacode": "216", "codename": "TN" },
            { "areacode": "676", "codename": "TO" },
            { "areacode": "90", "codename": "TR" },
            { "areacode": "1868", "codename": "TT" },
            { "areacode": "886", "codename": "TW" },
            { "areacode": "255", "codename": "TZ" },
            { "areacode": "380", "codename": "UA" },
            { "areacode": "256", "codename": "UG" },
            { "areacode": "1", "codename": "US" },
            { "areacode": "598", "codename": "UY" },
            { "areacode": "998", "codename": "UZ" },
            { "areacode": "1784", "codename": "VC" },
            { "areacode": "58", "codename": "VE" },
            { "areacode": "1284", "codename": "VG" },
            { "areacode": "84", "codename": "VN" },
            { "areacode": "678", "codename": "VU" },
            { "areacode": "685", "codename": "WS" },
            { "areacode": "967", "codename": "YE" },
            { "areacode": "269", "codename": "YT" },
            { "areacode": "27", "codename": "ZA" },
            { "areacode": "260", "codename": "ZM" },
            { "areacode": "263", "codename": "ZW" },
        ]

        static getAreaByLang(lang: string) {
            var idx = []
            switch (lang) {
                case "en":
                    idx = [3, 6, 55, 10, 1, 8, 5, 4, 9, 7, 13, 12, 11, 14, 29, 21, 17, 16, 32, 18, 33, 23, 24, 30, 26, 15, 31, 28, 25, 20, 19, 22, 102, 42, 34, 46, 27, 109, 36, 189, 41, 0, 43, 104, 40, 44, 86, 45, 47, 48, 49, 35, 52, 51, 53, 54, 193, 56, 58, 185, 78, 59, 57, 61, 65, 63, 62, 66, 71, 155, 67, 75, 70, 50, 72, 73, 79, 74, 69, 77, 81, 80, 76, 82, 83, 87, 85, 84, 88, 95, 92, 89, 94, 93, 90, 91, 96, 39, 97, 99, 98, 110, 100, 103, 106, 108, 101, 111, 120, 112, 117, 116, 121, 114, 118, 119, 132, 128, 126, 138, 140, 137, 129, 135, 127, 133, 136, 213, 139, 64, 124, 123, 131, 125, 134, 122, 141, 130, 142, 150, 149, 147, 143, 151, 146, 144, 145, 148, 152, 158, 163, 153, 156, 164, 154, 157, 159, 162, 161, 165, 37, 166, 167, 169, 170, 105, 113, 160, 206, 211, 180, 184, 171, 181, 168, 173, 179, 176, 178, 177, 172, 182, 214, 107, 60, 115, 174, 183, 187, 175, 38, 186, 199, 192, 200, 191, 190, 196, 198, 195, 197, 194, 188, 202, 201, 2, 68, 203, 204, 205, 210, 207, 209, 208, 212, 215, 216]
                    break;
                default:
                    idx = [1, 11, 12, 6, 55, 90, 3, 5, 8, 9, 58, 13, 2, 152, 14, 61, 57, 4, 16, 156, 31, 30, 95, 161, 32, 29, 20, 19, 158, 21, 159, 22, 164, 18, 26, 33, 24, 23, 153, 15, 28, 78, 106, 193, 50, 190, 52, 53, 54, 56, 169, 59, 66, 62, 157, 65, 155, 71, 45, 75, 81, 77, 80, 37, 35, 43, 70, 74, 69, 44, 83, 87, 85, 107, 147, 27, 125, 110, 216, 51, 101, 49, 103, 72, 34, 76, 82, 67, 102, 40, 86, 47, 42, 104, 109, 100, 46, 165, 108, 116, 112, 121, 167, 166, 119, 117, 118, 120, 111, 170, 114, 130, 126, 137, 124, 135, 131, 203, 17, 64, 129, 154, 122, 136, 133, 138, 140, 123, 128, 141, 127, 10, 134, 139, 213, 149, 214, 146, 150, 142, 144, 145, 148, 163, 162, 99, 175, 38, 160, 174, 184, 185, 168, 105, 178, 179, 115, 172, 183, 177, 113, 182, 180, 211, 181, 48, 173, 171, 187, 206, 197, 191, 196, 192, 194, 188, 198, 195, 200, 202, 201, 25, 204, 210, 207, 205, 60, 176, 143, 79, 186, 151, 39, 88, 92, 98, 96, 89, 68, 94, 93, 212, 97, 7, 209, 208, 91, 73, 215, 189, 36, 0, 132, 199, 84, 63, 41]
                    break;
            }
            if (idx.length > 0) {
                var rtn = []
                for (let i = 0; i < idx.length; i++) {
                    let a_idx = idx[i]
                    rtn.push(this.areaInfo[a_idx])
                }
                return rtn
            }
            else {
                return AreaView.areaInfo
            }
        }


        static getByAreaCode(areaCode: string) {
            var areaInfo = null;
            AreaView.areaInfo.forEach(
                area => {
                    if (area.areacode == areaCode) {
                        areaInfo = area;
                    }
                }
            )
            return areaInfo;
        }

        static getByCodeName(codeName: string) {
            var areaInfo = null;
            AreaView.areaInfo.forEach(
                area => {
                    if (area.codename == codeName) {
                        areaInfo = area;
                    }
                }
            )
            return areaInfo;
        }
    }
}