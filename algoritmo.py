variaveis = {
    "Deficiência intelectual" : { "M" : 32, "F" : 20 },
    "Face alongada/orelhas" : { "M" : 29, "F" : 9 },
    "Macroorquidismo" : { "M" : 26, "F" : 0 },
    "Hipermobilidade articular" : { "M": 19, "F" : 4},
    "Dificuldades de aprendizagem" : { "M" : 18, "F" : 28 },
    "Déficit de atenção" : { "M" : 17, "F" : 12 },
    "Mov. repetitivos" : { "M" : 17, "F" : 5 },
    "Atraso na fala" : { "M" : 14, "F" : 1 },
    "Hiperatividade" : { "M" : 12, "F" : 4 },
    "Evita contato visual" : { "M" : 6, "F" : 8 },
    "Evita contato físico" : {"M" : 4, "F" : 7},
    "Agressividade" : { "M" : 1, "F" : 2}
}

sintomas = ["Deficiência intelectual",
"Face alongada/orelhas",
"Macroorquidismo",
"Hipermobilidade articular",
"Dificuldades de aprendizagem",
"Déficit de atenção",
"Mov. repetitivos",
"Atraso na fala",
"Hiperatividade",
"Evita contato visual",
"Evita contato físico",
"Agressividade"]

print("Qual seu sexo? (M ou F)")
user_sexo = input()

user_sintomas = []

print("Você sente algum desses sintomas? Tecle \"Y\" para sim e \"N\" para não")

for i in range(len(sintomas)):
    print(sintomas[i])
    answer = input()
    if answer in ("Y", "y"):
        user_sintomas.append(i)

print(user_sintomas)

resultado = 0

for i in user_sintomas:
    resultado += variaveis[sintomas[i]][user_sexo]

print(f"{resultado/100}")

if (resultado >= 0.56 and user_sexo == "M") or (resultado >= 0.55 and user_sexo == "F"):
    print("Vai fazer o exame de verdade, agora! >:(")
else:
    print("Precisa fazer nada nn. :)")
