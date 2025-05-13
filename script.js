//character_interface construction

class DaiRow extends Map {
    constructor(table_name, row_num) {
        super();
        this.set("name", document.querySelector(`#${table_name}1${row_num}1`));
        this.set("base", document.querySelector(`#${table_name}1${row_num}2`));
        this.set("point", document.querySelector(`#${table_name}1${row_num}3`));
        this.set("growth", document.querySelector(`#${table_name}1${row_num}4`));
        this.set("skill", document.querySelector(`#${table_name}1${row_num}5`));
        this.set("shub", document.querySelector(`#${table_name}1${row_num}6`));
        this.set("total", document.querySelector(`#${table_name}1${row_num}7`));
    }
}

class ShubRow extends Map {
    constructor(table_name, row_num) {
        super();
        this.set("name", document.querySelector(`#${table_name}2${row_num}1`));
        this.set("base", document.querySelector(`#${table_name}2${row_num}2`));
        this.set("point", document.querySelector(`#${table_name}2${row_num}3`));
        this.set("growth", document.querySelector(`#${table_name}2${row_num}4`));
        this.set("skill", document.querySelector(`#${table_name}2${row_num}5`));
        this.set("dai", document.querySelector(`#${table_name}2${row_num}6`));
        this.set("total", document.querySelector(`#${table_name}2${row_num}7`));
    }
}

class PairOfRow extends Object {
    constructor(table_name, row_num) {
        super();
        this.d = new DaiRow(table_name, row_num);
        this.s = new ShubRow(table_name, row_num);
    }
}

class Table extends Array {
    constructor(table_name, row_length, mode = "pair", type_num = null) {
        super();
        this.table_name = table_name;
        this.type_num = type_num;
        this.mode = mode;
        if (mode == "pair") {
            for (let i = 1; i <= row_length; i++) {
                this.push(new PairOfRow(table_name, i));
            }
        }
        else if (mode == "single") {
            if (type_num == null) {
                throw new Error("type_num is required in single mode");
            }
            for (let i = 1; i <= row_length; i++) {
                if (type_num == 1) {
                    this.push(new DaiRow(table_name, i));
                } else if (type_num == 2) {
                    this.push(new ShubRow(table_name, i));
                } else {
                    throw new Error("Invalid type_num: " + type_num);
                }
            }
        } else {
            throw new Error("Invalid mode: " + mode);
        }
    }
    getRow(row_num) {
        return this[row_num - 1];
    }
}

class Tables extends Map {
    constructor() {
        super();
        this.set("tan", new Table("tan", 12, "pair"));
        this.set("sen", new Table("sen", 10, "pair"));
        this.set("tai", new Table("tai", 3, "pair"));
        this.set("tis", new Table("tis", 15, "pair"));
        this.set("unn", new Table("unn", 3, "pair"));
        this.set("skn", new Table("skn", 1, "single", 2));
    }
    getVTotal(column_name) {
        let [d_total, s_total] = [0, 0];
        this.forEach((table) => {
            if (table.table_name == "skn") {
                s_total += Number(table.getRow(1).get(column_name).value);
            } else {
                table.forEach((row) => {
                    d_total += Number(row.d.get(column_name).value);
                    s_total += Number(row.s.get(column_name).value);
                });
            }
        });
        return [d_total, s_total];
    }
}

class DaiProfile extends Map {
    constructor() {
        super();
        this.set("name", document.querySelector("#Name11"));
        this.set("name_ruby", document.querySelector("#Name12"));
        this.set("gender", document.querySelector("#Name13"));
        this.set("age", document.querySelector("#Name14"));
        this.set("hp", document.querySelector("#Name15"));
        this.set("sk", document.querySelector("#Name16"));
        this.set("decade_rate", document.querySelector("#Name17"));
        this.set("kinryoku", document.querySelector("#Name18"));
        this.set("initiative", document.querySelector("#Name19"));
        this.set("taikaku", document.querySelector("#Name110"));
        this.set("app", document.querySelector("#Name111"));
        this.set("dice", document.querySelector("#dice1"));
    }
}

class ShubProfile extends Map {
    constructor() {
        super();
        this.set("name", document.querySelector("#Name21"));
        this.set("name_ruby", document.querySelector("#Name22"));
        this.set("gender", document.querySelector("#Name23"));
        this.set("kisei_year", document.querySelector("#Name24"));
        this.set("color", document.querySelector("#Name25"));
        this.set("life", document.querySelector("#Name26"));
        this.set("sk_skill", document.querySelector("#Name27"));
        this.set("sk_skill_description", document.querySelector("#Name28"));
        this.set("hp", document.querySelector("#Name29"));
        this.set("sk", document.querySelector("#Name210"));
        this.set("kairi_rate", document.querySelector("#Name211"));
        this.set("kinryoku", document.querySelector("#Name212"));
        this.set("initiative", document.querySelector("#Name213"));
        this.set("taikaku", document.querySelector("#Name214"));
        this.set("app", document.querySelector("#Name215"));
        this.set("dice", document.querySelector("#dice2"));
    }
}

class ResultTables extends Map {
    constructor() {
        super();
        for (let i = 1; i <= 6; i++) {
            this.set("Result" + i, document.querySelector("#Result" + i));
        }
    }
}

// character interface
class CharacterInterface {
    constructor() {
        this.dai_profile = new DaiProfile();
        this.shub_profile = new ShubProfile();
        this.tables = new Tables();
        this.result_tables = new ResultTables();
        this.character_tabs = [document.querySelector("#tabpage1"), document.querySelector("#tabpage2")];

        this.tables.forEach((table, table_name) => {
            if (table_name == "skn") {
                const row = table.getRow(1);
                ["point", "growth"].forEach((key) => {
                    row.get(key).addEventListener("input", () => {
                        row.get("skill").value = Number(row.get("base").value) + Number(row.get("point").value) + Number(row.get("growth").value);
                        row.get("total").value = Number(row.get("skill").value) + Number(row.get("dai").value);
                        this.result_tables.get("Result2").value = this.result_tables.get("Result5").value = this.tables.getVTotal("point")[1];
                        this.result_tables.get("Result3").value = this.result_tables.get("Result6").value = Number(this.result_tables.get("Result1").value) + Number(this.result_tables.get("Result2").value);
                    });
                });
            } else {
                table.forEach((row, row_num) => {
                    ["point", "growth"].forEach((key) => {
                        row.d.get(key).addEventListener("input", () => {
                            row.d.get("skill").value = Number(row.d.get("base").value) + Number(row.d.get("point").value) + Number(row.d.get("growth").value);
                            row.d.get("total").value = Number(row.d.get("skill").value) + Number(row.d.get("shub").value);
                            row.s.get("dai").value = Number(row.d.get("skill").value);
                            row.s.get("total").value = Number(row.s.get("skill").value) + Number(row.s.get("dai").value);
                            this.result_tables.get("Result1").value = this.result_tables.get("Result4").value = this.tables.getVTotal("point")[0];
                            this.result_tables.get("Result3").value = this.result_tables.get("Result6").value = Number(this.result_tables.get("Result1").value) + Number(this.result_tables.get("Result2").value);
                        });
                        row.s.get(key).addEventListener("input", () => {
                            row.s.get("skill").value = Number(row.s.get("base").value) + Number(row.s.get("point").value) + Number(row.s.get("growth").value);
                            row.s.get("total").value = Number(row.s.get("skill").value) + Number(row.s.get("dai").value);
                            row.d.get("shub").value = Number(row.s.get("skill").value);
                            row.d.get("total").value = Number(row.d.get("skill").value) + Number(row.d.get("shub").value);
                            this.result_tables.get("Result2").value = this.result_tables.get("Result5").value = this.tables.getVTotal("point")[1];
                            this.result_tables.get("Result3").value = this.result_tables.get("Result6").value = Number(this.result_tables.get("Result1").value) + Number(this.result_tables.get("Result2").value);
                        });
                    });
                });
            }
        });
    }

    display_character(input_character) {
        console.log("display_character <-", input_character);
        for (const [key, elm] of this.dai_profile) {
            elm.value = input_character.dai_profile[key];
        }
        for (const [key, elm] of this.shub_profile) {
            elm.value = input_character.shub_profile[key];
        }
        this.tables.forEach((table, table_name) => {
            if (table_name == "skn") {
                table.getRow(1).get("point").value = input_character.input_tables[table_name].point;
                table.getRow(1).get("growth").value = input_character.input_tables[table_name].growth;
            } else {
                for (let i = 1; i < table.length; i++) {
                    table.getRow(i).d.get("point").value = input_character.input_tables[table_name].point.d[i - 1];
                    table.getRow(i).d.get("growth").value = input_character.input_tables[table_name].growth.d[i - 1];
                    table.getRow(i).s.get("point").value = input_character.input_tables[table_name].point.s[i - 1];
                    table.getRow(i).s.get("growth").value = input_character.input_tables[table_name].growth.s[i - 1];
                }
            }
        });
        this.tables.get("skn").getRow(1).get("name").value = input_character.skn_name;
        this.tables.get("tan").getRow(11).d.get("name").value = input_character.dai_tan11_name;
        this.tables.get("tan").getRow(11).s.get("name").value = input_character.shub_tan11_name;
    }

    get_character_name() {
        return this.dai_profile.get("name").value + "/" + this.shub_profile.get("name").value;
    }
}

// input tables
class InputTables {
    constructor(table_elms) {
        for (const [table_name, table_elm] of table_elms) {
            if (table_name === "skn") {
                this[table_name] = { point: "", growth: "" };
                this[table_name].point = table_elm.getRow(1).get("point").value;
                this[table_name].growth = table_elm.getRow(1).get("growth").value;
            } else {
                this[table_name] = { point: { d: [], s: [] }, growth: { d: [], s: [] } };
                for (let i = 1; i < table_elm.length; i++) {
                    this[table_name].point.d.push(table_elm.getRow(i).d.get("point").value);
                    this[table_name].growth.d.push(table_elm.getRow(i).d.get("growth").value);
                    this[table_name].point.s.push(table_elm.getRow(i).s.get("point").value);
                    this[table_name].growth.s.push(table_elm.getRow(i).s.get("growth").value);
                }
            }
        }
    }
}

class InputCharacter {
    constructor(character_interface) {
        this.dai_profile = {};
        for (const [key, elm] of character_interface.dai_profile) {
            this.dai_profile[key] = elm.value;
        }
        this.shub_profile = {};
        for (const [key, elm] of character_interface.shub_profile) {
            this.shub_profile[key] = elm.value;
        }
        this.input_tables = Object.assign({}, new InputTables(character_interface.tables));
        this.dai_tan11_name = character_interface.tables.get("tan").getRow(11).d.get("name").value;
        this.shub_tan11_name = character_interface.tables.get("tan").getRow(11).s.get("name").value;
        this.skn_name = character_interface.tables.get("skn").getRow(1).get("name").value;
    }
}


// database interface
class DatabaseInterface {
    constructor() {
        this.character_list = document.querySelector("#characters_list");
        this.create_character_button = document.querySelector("#create_character");
        this.copy_button = [document.querySelector("#copy_button1"), document.querySelector("#copy_button2")];
        this.save_button = document.querySelectorAll(".save_button");
        this.delete_button = document.querySelectorAll(".delete_button");
        this.current_character = document.querySelector("#current_character");
        this.character_list.addEventListener("click", (e) => {
            if (e.target.tagName == "LI") {
                console.log("キャラクター選択", e.target.innerText);
                database.load_character(e.target.innerText);
            }
        });
        this.create_character_button.addEventListener("click", () => {
            database.create_new_character();
        });
        this.copy_button.forEach((button, i) => {
            button.addEventListener("click", () => {
                database.copy_character(i + 1);
            });
        });
        this.save_button.forEach((button) => {
            button.addEventListener("click", () => {
                database.add_current_character();
                database.save_data();
            });
        });
        this.delete_button.forEach((button) => {
            button.addEventListener("click", () => {
                const character_name = database.state.current_character_name;
                database.delete_character(character_name);
            });
        });
        

    }

}

// main
const database = {
    character_interface: new CharacterInterface(),
    database_interface: new DatabaseInterface(),
    input_characters: {}, // input_character: dainame/shubname:InputCharacter
    state: {
        state: "init",
        current_character_name: null
    },
    init() {
        [this.character_interface.dai_profile, this.character_interface.shub_profile].forEach((profile) => {
            profile.get("name").addEventListener("input", () => {
                this.state.current_character_name = this.character_interface.get_character_name();
                if (this.input_characters[this.state.current_character_name]) {
                    this.database_interface.save_button.forEach((button) => {
                        button.innerText = "上書き保存";
                    });
                } else {
                    this.database_interface.save_button.forEach((button) => {
                        button.innerText = "新規保存";
                    });
                }
            });
        });
        this.character_interface.character_tabs.forEach((tab) => {
            tab.addEventListener("input", (e) => {
                console.log("modified", e.target.id, e.target.value);
                this.database_interface.current_character.innerText = this.state.current_character_name + " *";
            }
            );
        });
        this.input_characters = JSON.parse(localStorage.getItem("input_characters") || "{}");
        console.log("input_characters", this.input_characters);
        try {
            this.state.current_character_name = Object.keys(this.input_characters)[0];
            this.character_interface.display_character(this.input_characters[this.state.current_character_name]);
            console.log("キャラクターが見つかりました");
            // キャラクターリストを表示
            for (const [key, value] of Object.entries(this.input_characters)) {
                const li = document.createElement("li");
                li.innerText = key;
                li.setAttribute("class", "character_record");
                this.database_interface.character_list.prepend(li);
            }
            this.database_interface.current_character.innerText = this.state.current_character_name;
            this.database_interface.save_button.forEach((button) => {
                button.innerText = "上書き保存";
            });
        }catch (e) {
            console.log("キャラクターが見つかりません");
            localStorage.clear();
            this.character_interface.display_character(new InputCharacter(this.character_interface));
            this.state.current_character_name = "はじめてのキャラクター";
            this.database_interface.current_character.innerText = this.state.current_character_name;
        }
    },
    load_character(character_name) {
        if (this.input_characters[character_name]) {
            this.character_interface.display_character(this.input_characters[character_name]);
            this.state.current_character_name = character_name;
            this.database_interface.current_character.innerText = this.state.current_character_name;
        } else {
            console.log("キャラクターが見つかりません");
        }
    },
    create_new_character() {
        this.character_interface.display_character({
            "dai_profile": {
                "name": "",
                "name_ruby": "",
                "gender": "",
                "age": "",
                "hp": "",
                "sk": "",
                "decade_rate": "",
                "kinryoku": "",
                "initiative": "",
                "taikaku": "",
                "app": "",
                "dice": "dice"
            },
            "shub_profile": {
                "name": "",
                "name_ruby": "",
                "gender": "",
                "kisei_year": "",
                "color": "",
                "life": "",
                "sk_skill": "",
                "sk_skill_description": "",
                "hp": "",
                "sk": "",
                "kairi_rate": "",
                "kinryoku": "",
                "initiative": "",
                "taikaku": "",
                "app": "",
                "dice": "dice"
            },
            "input_tables": {
                "tan": {
                    "point": {
                        "d": [
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            ""
                        ],
                        "s": [
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            ""
                        ]
                    },
                    "growth": {
                        "d": [
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            ""
                        ],
                        "s": [
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            ""
                        ]
                    }
                },
                "sen": {
                    "point": {
                        "d": [
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            ""
                        ],
                        "s": [
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            ""
                        ]
                    },
                    "growth": {
                        "d": [
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            ""
                        ],
                        "s": [
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            ""
                        ]
                    }
                },
                "tai": {
                    "point": {
                        "d": [
                            "",
                            ""
                        ],
                        "s": [
                            "",
                            ""
                        ]
                    },
                    "growth": {
                        "d": [
                            "",
                            ""
                        ],
                        "s": [
                            "",
                            ""
                        ]
                    }
                },
                "tis": {
                    "point": {
                        "d": [
                            "0",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            ""
                        ],
                        "s": [
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            ""
                        ]
                    },
                    "growth": {
                        "d": [
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            ""
                        ],
                        "s": [
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            ""
                        ]
                    }
                },
                "unn": {
                    "point": {
                        "d": [
                            "",
                            ""
                        ],
                        "s": [
                            "",
                            ""
                        ]
                    },
                    "growth": {
                        "d": [
                            "",
                            ""
                        ],
                        "s": [
                            "",
                            ""
                        ]
                    }
                },
                "skn": {
                    "point": "",
                    "growth": ""
                }
            },
            "dai_tan11_name": "痕跡(戦闘)",
            "shub_tan11_name": "痕跡(戦闘)",
            "skn_name": "SK能力"
        });

        this.state.current_character_name = "新規キャラクター";
        this.database_interface.current_character.innerText = this.state.current_character_name;
    },
    add_current_character() {
        if (this.state.current_character_name) {
            this.input_characters[this.state.current_character_name] = new InputCharacter(this.character_interface);
            const li = document.createElement("li");
            li.innerText = this.state.current_character_name;
            li.setAttribute("class", "character_record");
            this.database_interface.character_list.prepend(li);
        }
    },
    copy_character(type) {
        let obj = {};
        if (type == 1) {
            with (this.character_interface.dai_profile) {
                obj = {
                    kind: "character",
                    data: {
                        name: `${get("name").value} (${get("name_ruby").value})`,
                        initiative: Number(get("initiative").value),
                        status: [{
                            label: "HP",
                            value: get("hp").value,
                            max: get("hp").value,
                        },
                        {
                            label: "SK",
                            value: get("sk").value,
                            max: get("sk").value,
                        },
                        {
                            label: "腐敗率",
                            value: get("decade_rate").value,
                            max: 100,
                        },
                        {
                            label: "シュブルテ",
                            value: this.character_interface.shub_profile.get("kairi_rate").value,
                        },
                        ],
                        params: [{
                            label: "筋力基礎値",
                            value: get("kinryoku").value,

                        }],
                    },
                }
            }
            with (this.character_interface.tables) {
                obj.data.commands = `100-{腐敗率}*3/4-{シュブルテ}*1/4-1d100>=0 【腐敗判定】 \n:シュブルテ=
            〇探索系技能 \n${get("tan").getRow(1).d.get("skill").value}-1d100>=0 【知覚】\n${get("tan").getRow(2).d.get("skill").value}-1d100>=0 【観察】 \n${get("tan").getRow(3).d.get("skill").value}-1d100>=0 【人間観察】\n${get("tan").getRow(4).d.get("skill").value}-1d100>=0 【応急処置】 \n${get("tan").getRow(5).d.get("skill").value}-1d100>=0 【隠蔽】 \n${get("tan").getRow(6).d.get("skill").value}-1d100>=0 【潜伏】 \n${get("tan").getRow(7).d.get("skill").value}-1d100>=0 【検索】 \n${get("tan").getRow(8).d.get("skill").value}-1d100>=0 【体内時計】 \n${get("tan").getRow(9).d.get("skill").value}-1d100>=0 【結合】 \n${get("tan").getRow(10).d[4]}-1d100>=0 【痕跡(スカミア)】 \n${get("tan").getRow(11).d[4]}-1d100>=0 【痕跡(戦闘)】 \n${get("tan").getRow(12).d[4]}-1d100>=0 【${get("tan").getRow(12).d[0]}】
            〇戦闘系技能 \n${get("sen").getRow(1).d.get("skill").value}-1d100>=0 【躱す】 \n${get("sen").getRow(2).d.get("skill").value}-1d100>=0 【見切り】 \n${get("sen").getRow(3).d.get("skill").value}-1d100>=0 【死んだふり】 \n${get("sen").getRow(4).d.get("skill").value}-1d100>=0 【体術】 \n${get("sen").getRow(5).d.get("skill").value}-1d100>=0 【投げつける】 \n${get("sen").getRow(6).d.get("skill").value}-1d100>=0 【締め落とし】 \n${get("sen").getRow(7).d.get("skill").value}-1d100>=0 【特攻】 \n${get("sen").getRow(8).d.get("skill").value}-1d100>=0 【銃火器】 \n${get("sen").getRow(9).d.get("skill").value}-1d100>=0 【刀】 \n${get("sen").getRow(10).d.get("skill").value}-1d100>=0 【スカミア銃】 \n{筋力基礎値}+{HP}-1d100>=0 【筋力】 \n{initiative}-1d100>=0 【速さ】
            〇対人系技能 \n${get("tai").getRow(1).d.get("skill").value}-1d100>=0 【攪乱】 \n${get("tai").getRow(2).d.get("skill").value}-1d100>=0 【交渉】 \n${get("tai").getRow(3).d.get("skill").value}-1d100>=0 【恐喝】
            〇知識系技能 \n${get("tis").getRow(1).d.get("skill").value}-1d100>=0 【シュブルテ言語】 \n${get("tis").getRow(2).d.get("skill").value}-1d100>=0 【料理】 \n${get("tis").getRow(3).d.get("skill").value}-1d100>=0 【スカミア学】 \n${get("tis").getRow(4).d.get("skill").value}-1d100>=0 【考古学】 \n${get("tis").getRow(5).d.get("skill").value}-1d100>=0 【戦闘知識】 \n${get("tis").getRow(6).d.get("skill").value}-1d100>=0 【解剖学】 \n${get("tis").getRow(7).d.get("skill").value}-1d100>=0 【他言語】 \n${get("tis").getRow(8).d.get("skill").value}-1d100>=0 【現代史】 \n${get("tis").getRow(9).d.get("skill").value}-1d100>=0 【科学】 \n${get("tis").getRow(10).d.get("skill").value}-1d100>=0 【天文学】 \n${get("tis").getRow(11).d.get("skill").value}-1d100>=0 【電子機器】 \n${get("tis").getRow(12).d.get("skill").value}-1d100>=0 【芸術】 \n${get("tis").getRow(13).d.get("skill").value}-1d100>=0 【加工術】 \n${get("tis").getRow(14).d.get("skill").value}-1d100>=0 【考案】 \n${get("tis").getRow(15).d.get("skill").value}-1d100>=0 【知識】
            〇運技能 \n${get("unn").getRow(1).d.get("skill").value}-1d100>=0 【弱運】 \n${get("unn").getRow(2).d.get("skill").value}-1d100>=0 【運】 \n${get("unn").getRow(3).d.get("skill").value}-1d100>=0 【強運】
            〇完全化 \n100-1d({腐敗率}+{シュブルテ})>=0 【完全化判定】\n{シュブルテ}-1d({腐敗率}+{シュブルテ})>=0 【犠牲者決定】 \nC100-({腐敗率}*3/4+{シュブルテ}*1/4) 【期待値計算】`;
            }
        } else if (type == 2) {
            with (this.character_interface.shub_profile) {
                obj = {
                    kind: "character",
                    data: {
                        name: `${get("name").value} (${get("name_ruby").value})`,
                        initiative: Number(get("initiative").value),
                        status: [{
                            label: "HP",
                            value: get("hp").value,
                            max: get("hp").value,
                        },
                        {
                            label: "SK",
                            value: get("sk").value,
                            max: get("sk").value,
                        },
                        {
                            label: "乖離率",
                            value: get("kairi_rate").value,
                            max: 100,
                        },
                        {
                            label: "代償者",
                            value: this.character_interface.dai_profile.get("decade_rate").value,
                        },
                        ],
                        params: [{
                            label: "筋力基礎値",
                            value: get("kinryoku").value,

                        }],
                    },
                }
            }
            with (this.character_interface.tables) {
                obj.data.commands = `100-{乖離率}*3/4-{代償者}*1/4-1d100>=0 【乖離判定】 \n:代償者=
                〇探索系技能 \n${get("tan").getRow(1).s.get("skill").value}-1d100>=0 【知覚】\n${get("tan").getRow(2).s.get("skill").value}-1d100>=0 【観察】 \n${get("tan").getRow(3).s.get("skill").value}-1d100>=0 【人間観察】\n${get("tan").getRow(4).s.get("skill").value}-1d100>=0 【応急処置】 \n${get("tan").getRow(5).s.get("skill").value}-1d100>=0 【隠蔽】 \n${get("tan").getRow(6).s.get("skill").value}-1d100>=0 【潜伏】 \n${get("tan").getRow(7).s.get("skill").value}-1d100>=0 【検索】 \n${get("tan").getRow(8).s.get("skill").value}-1d100>=0 【体内時計】 \n${get("tan").getRow(9).s.get("skill").value}-1d100>=0 【結合】 \n${get("tan").getRow(10).s.get("skill").value}-1d100>=0 【痕跡(スカミア)】 \n${get("tan").getRow(11).s.get("skill").value}-1d100>=0 【痕跡(戦闘)】 \n${get("tan").getRow(12).s.get("skill").value}-1d100>=0 【${get("tan").getRow(12).s.get("name").value}】
                〇戦闘系技能 \n${get("sen").getRow(1).s.get("skill").value}-1d100>=0 【躱す】 \n${get("sen").getRow(2).s.get("skill").value}-1d100>=0 【見切り】 \n${get("sen").getRow(3).s.get("skill").value}-1d100>=0 【死んだふり】 \n${get("sen").getRow(4).s.get("skill").value}-1d100>=0 【体術】 \n${get("sen").getRow(5).s.get("skill").value}-1d100>=0 【投げつける】 \n${get("sen").getRow(6).s.get("skill").value}-1d100>=0 【締め落とし】 \n${get("sen").getRow(7).s.get("skill").value}-1d100>=0 【特攻】 \n${get("sen").getRow(8).s.get("skill").value}-1d100>=0 【銃火器】 \n${get("sen").getRow(9).s.get("skill").value}-1d100>=0 【刀】 \n${get("sen").getRow(10).s.get("skill").value}-1d100>=0 【スカミア銃】 \n{筋力基礎値}+{HP}-1d100>=0 【筋力】 \n{initiative}-1d100>=0 【速さ】
                〇対人系技能 \n${get("tai").getRow(1).s.get("skill").value}-1d100>=0 【攪乱】 \n${get("tai").getRow(2).s.get("skill").value}-1d100>=0 【交渉】 \n${get("tai").getRow(3).s.get("skill").value}-1d100>=0 【恐喝】
                〇知識系技能 \n${get("tis").getRow(1).s.get("skill").value}-1d100>=0 【シュブルテ言語】 \n${get("tis").getRow(2).s.get("skill").value}-1d100>=0 【料理】 \n${get("tis").getRow(3).s.get("skill").value}-1d100>=0 【スカミア学】 \n${get("tis").getRow(4).s.get("skill").value}-1d100>=0 【考古学】 \n${get("tis").getRow(5).s.get("skill").value}-1d100>=0 【戦闘知識】 \n${get("tis").getRow(6).s.get("skill").value}-1d100>=0 【解剖学】 \n${get("tis").getRow(7).s.get("skill").value}-1d100>=0 【他言語】 \n${get("tis").getRow(8).s.get("skill").value}-1d100>=0 【現代史】 \n${get("tis").getRow(9).s.get("skill").value}-1d100>=0 【科学】 \n${get("tis").getRow(10).s.get("skill").value}-1d100>=0 【天文学】 \n${get("tis").getRow(11).s.get("skill").value}-1d100>=0 【電子機器】 \n${get("tis").getRow(12).s.get("skill").value}-1d100>=0 【芸術】 \n${get("tis").getRow(13).s.get("skill").value}-1d100>=0 【加工術】 \n${get("tis").getRow(14).s.get("skill").value}-1d100>=0 【考案】 \n${get("tis").getRow(15).s.get("skill").value}-1d100>=0 【知識】
                〇運技能 \n${get("unn").getRow(1).s.get("skill").value}-1d100>=0 【弱運】 \n${get("unn").getRow(2).s.get("skill").value}-1d100>=0 【運】 \n${get("unn").getRow(3).s.get("skill").value}-1d100>=0 【強運】
                〇SK能力 \n${get("skn").getRow(1).get("skill").value}-1d100>=0 【SK能力】
                〇完全化 \n100-1d({乖離率}+{代償者})>=0 【完全化判定】\n{代償者}-1d({乖離率}+{代償者})>=0 【犠牲者決定】 \nC100-({乖離率}*3/4+{代償者}*1/4) 【期待値計算】`;
            }
        }
        let data = JSON.stringify(obj);
        navigator.clipboard.writeText(data)
            .then(() => {
                console.log('コピーしました: ', data);
                alert('コピーしました: ');
            }).catch(err => {
                console.error('コピーに失敗しました: ', err);
                alert('コピーに失敗しました: ' + err);
            });

    },
    save_data() {
        localStorage.setItem("input_characters", JSON.stringify(this.input_characters));
        this.database_interface.current_character.innerText = this.state.current_character_name;
        this.database_interface.save_button.forEach((button) => {
            button.innerText = "上書き保存";
        });
        console.log("データを保存しました");
        console.log(this.input_characters);
        console.log("characters", localStorage.getItem("input_characters"));
        alert("データを保存しました");
    },
    delete_character(character_name) {
        if (this.input_characters[character_name]) {
            delete this.input_characters[character_name];
            const lis = document.querySelectorAll(".character_record");
            if (lis) {
                lis.forEach((li) => {
                    if (li.innerText == character_name) {
                        li.remove();
                    }
                });
            }
        } else {
            console.log("キャラクターが見つかりません");
        }
        localStorage.setItem("input_characters", JSON.stringify(this.input_characters));
        this.database_interface.current_character.innerText = this.state.current_character_name;
        this.database_interface.save_button.forEach((button) => {
            button.innerText = "新規保存";
        });
        console.log("キャラクターを削除しました");
        alert("キャラクターを削除しました");
    }


}

dice1.addEventListener("click", function(){
    Name110.value = Number(Math.floor(Math.random()*10)+1);
    Name111.value = Number(Math.floor(Math.random()*10)+1);
})

dice2.addEventListener("click", function(){
    Name214.value = Number(Math.floor(Math.random()*10)+1);
    Name215.value = Number(Math.floor(Math.random()*10)+1);
})

database.init();
console.log(database.input_characters);
