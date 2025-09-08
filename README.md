Sudoku mobilna aplikacija razvijena za Android i planirana za iOS (još nije testirana na iOS-u), napravljena pomoću React Native CLI arhitekture.

Glavna logika i osnovne funkcije napisane su u TypeScriptu, dok su zahtevnije operacije – poput generisanja table, davanja nasumičnih hintova i rešavanja table – implementirane u C++ (jer je u TypeScriptu to bilo presporo). Ove funkcionalnosti povezane su preko JNI bridge-a u Kotlinu.

Trenutno su implementirane glavne funkcionalnosti aplikacije, među kojima su:
davanje hintova (random hint i super hint), generisanje sudoku table, unos i brisanje vrednosti u poljima, kreiranje nove table, meni za izbor težine (difficulty), i još nekoliko dodatnih opcija.

Za sada aplikacija koristi jednostavan UI, ali sam u Figmi pripremio redizajn sa potpuno novim i modernijim izgledom. Novi interfejs je prilagođen za jednostavnije korišćenje.

Sta jos planiram da inplementiram:
1. Undo dugme
2. Tajmer
3. Socring sistem (na osnovu vremena, tezine table)
4. Sistem za levelovanje profila
5. Brojac gresaka
6. Kompletan redesign aplikacije
7. Shop (za sad samo razliciti izgledi boarda i ostatka UIa)
8. Scoreboard (bazu podataka za to)
9. Podesavanje za ISO
