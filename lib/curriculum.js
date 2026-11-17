// w: "English=Özbekça" words (8) ; s: "Özbekça=English" sentences (6).
// Sentences 0-1 -> listening, 2-3 -> uz->en, 4-5 -> en->uz.
import A1 from "./units/a1";
import A2 from "./units/a2";
import B1 from "./units/b1";
import B2 from "./units/b2";

// The original 15 chapters stay first and unchanged (lesson ids 1..45 are stored in the database);
// new chapters are only ever appended after them.
const BASE = [
{ t: "Salomlaşiş", lv: "A1", tip: "İngliz tilida salomlaşiş uçun Hello yoki Hi işlatiladi. Hello rasmiyroq.", l: [
 { t: "Salom va xayr", w: ["Hello=Salom","Goodbye=Xayr","Thank you=Rahmat","Please=İltimos","Sorry=Keçirasiz","Yes=Ha","No=Yöq","Welcome=Xuş kelibsiz"],
   s: ["Salom döstim=Hello my friend","Rahmat döstim=Thank you my friend","Xayr döstim=Goodbye my friend","İltimos kiring=Please come in","Ha rahmat=Yes thank you","Yöq rahmat=No thank you"] },
 { t: "Kun vaqtlari", w: ["Morning=Tong","Day=Kun","Evening=Keç","Night=Tun","Today=Bugun","Tomorrow=Ertaga","Friend=Döst","Good=Yaxşi"],
   s: ["Xayrli tong=Good morning","Xayrli tun=Good night","Xayrli keç=Good evening","Ertagaça körişamiz=See you tomorrow","Kuningiz xayrli=Have a good day","Bugun yaxşi kun=Today is a good day"] },
 { t: "Qalaysiz?", w: ["How=Qanday","You=Siz","I=Men","Fine=Yaxşi","Very=Juda","Tired=Çarçagan","Happy=Xursand","Sad=Xafa"],
   s: ["Men yaxşiman=I am fine","Men juda xursandman=I am very happy","Qalaysiz=How are you","Men çarçaganman=I am tired","Siz xafamisiz=Are you sad","Tanişganimdan xursandman=Nice to meet you"] } ] },
{ t: "Özim haqimda", lv: "A1", tip: "İngliz tilida «men» (I) har doim boş harf bilan yoziladi.", l: [
 { t: "İsm va yoş", w: ["Name=İsm","My=Mening","Your=Sizning","Age=Yoş","Years old=Yoşda","Boy=Yigit","Girl=Qiz","Student=Talaba"],
   s: ["Mening ismim Ali=My name is Ali","Men talabaman=I am a student","İsmingiz nima=What is your name","Men yigirma yoşdaman=I am twenty years old","U qiz=She is a girl","U yigit=He is a boy"] },
 { t: "Qayerdansiz", w: ["Where=Qayerda","Country=Mamlakat","City=Şahar","Uzbekistan=Özbekiston","Capital=Poytaxt","Language=Til","English=İngliz tili","Uzbek=Özbek tili"],
   s: ["Men Toşkentda yaşayman=I live in Tashkent","Men özbek tilida gapiraman=I speak Uzbek","Men Özbekistondanman=I am from Uzbekistan","Siz qayerdansiz=Where are you from","Men ingliz tilini örganaman=I learn English","Toşkent katta şahar=Tashkent is a big city"] },
 { t: "Savol beriş", w: ["What=Nima","Who=Kim","Why=Nega","When=Qaçon","How much=Qança","Question=Savol","Answer=Javob","Help=Yordam"],
   s: ["U kim=Who is he","Menda savol bor=I have a question","Bu nima=What is this","Dars qaçon=When is the lesson","Nega siz xafasiz=Why are you sad","Menga yordam bera olasizmi=Can you help me"] } ] },
{ t: "Oila", lv: "A1", tip: "İngliz tilida egalik: my, your, his, her ot oldidan keladi.", l: [
 { t: "Oila aʼzolari", w: ["Mother=Ona","Father=Ota","Brother=Aka","Sister=Opa","Son=Öğil","Daughter=Qiz","Grandmother=Buvi","Grandfather=Bobo"],
   s: ["Bu mening onam=This is my mother","Mening otam şifokor=My father is a doctor","Men oilamni sevaman=I love my family","Mening akam bor=I have a brother","U mening opam=She is my sister","U mening bobom=He is my grandfather"] },
 { t: "Oila haqida", w: ["Family=Oila","Parents=Ota-ona","Child=Bola","Children=Bolalar","Husband=Er","Wife=Xotin","Uncle=Amaki","Aunt=Xola"],
   s: ["Biz katta oilamiz=We are a big family","Ularda çaqaloq bor=They have a baby","Ota-onam uyda=My parents are at home","Menda ikkita bola bor=I have two children","Amakim baland=My uncle is tall","Uning xolasi mehribon=Her aunt is kind"] },
 { t: "Tavsif", w: ["Tall=Baland","Short=Pas","Old=Keksa","Young=Yoş","Kind=Mehribon","Funny=Qiziq","Smart=Aqlli","Beautiful=Çiroyli"],
   s: ["Akam baland=My brother is tall","Opam yoş=My sister is young","Bobom keksa=My grandfather is old","Qiz çiroyli=The girl is beautiful","U juda mehribon=She is very kind","U aqlli=He is smart"] } ] },
{ t: "Ovqat va içimlik", lv: "A1", tip: "Sanalmaydigan otlar (water, milk) oldidan a/an qöyilmaydi.", l: [
 { t: "Suv va non", w: ["Water=Suv","Bread=Non","Milk=Sut","Apple=Olma","Egg=Tuxum","Rice=Guruç","Meat=Göşt","Fish=Baliq"],
   s: ["Men suv içaman=I drink water","Men non yeyman=I eat bread","U sut içadi=She drinks milk","U guruç yeydi=He eats rice","Menga olma yoqadi=I like apples","Biz baliq yeymiz=We eat fish"] },
 { t: "İçimliklar", w: ["Tea=Çoy","Coffee=Qahva","Juice=Şarbat","Sugar=Şakar","Salt=Tuz","Cup=Piyola","Hot=İssiq","Cold=Sovuq"],
   s: ["Men çoy xohlayman=I want tea","Çoy issiq=The tea is hot","Şarbat sovuq=The juice is cold","Siz qahva xohlaysizmi=Do you want coffee","Şakarli qahva=Coffee with sugar","Menga bir piyola çoy bering=Give me a cup of tea"] },
 { t: "Restoranda", w: ["Menu=Menyu","Table=Stol","Waiter=Ofitsiant","Bill=Hisob","Breakfast=Nonuşta","Lunch=Tuşlik","Hungry=Qorni oçgan","Delicious=Mazali"],
   s: ["Mening qornim oç=I am hungry","Ovqat mazali=The food is delicious","İltimos ikki kişilik stol=A table for two please","Menyuni körsam böladimi=Can I see the menu","İltimos hisob=The bill please","Men nonuşta xohlayman=I want breakfast"] } ] },
{ t: "Raqamlar va vaqt", lv: "A1", tip: "13–19 oxiri -teen, 20–90 oxiri -ty bilan tugaydi: thirteen, thirty.", l: [
 { t: "1–8 raqamlar", w: ["One=Bir","Two=İkki","Three=Uç","Four=Tört","Five=Beş","Six=Olti","Seven=Yetti","Eight=Sakkiz"],
   s: ["Menda ikkita aka bor=I have two brothers","U sakkiz yoşda=He is eight years old","Beşta kitob bor=There are five books","Bizda tört dars bor=We have four lessons","Uning uçta olmasi bor=She has three apples","Men olti quş köraman=I see six birds"] },
 { t: "Katta sonlar", w: ["Nine=Töqqiz","Ten=Ön","Twenty=Yigirma","Thirty=Öttiz","Fifty=Ellik","Hundred=Yuz","Thousand=Ming","Zero=Nol"],
   s: ["Önta talaba bor=There are ten students","Menda öttizta kitob bor=I have thirty books","Kitobda yuz bet bor=The book has one hundred pages","U ellik ming turadi=It costs fifty thousand","İkki yuz kişi=Two hundred people","Nol ham son=Zero is a number"] },
 { t: "Vaqt va kunlar", w: ["Time=Vaqt","Hour=Soat","Minute=Daqiqa","Monday=Duşanba","Friday=Juma","Sunday=Yakşanba","Week=Hafta","Year=Yil"],
   s: ["Soat neça=What time is it","Men juma kuni işlayman=I work on Friday","Dars duşanba kuni=The lesson is on Monday","Bir haftada yetti kun bor=A week has seven days","Yakşanba kuni körişamiz=See you on Sunday","Dars soat töqqizda=The lesson is at nine"] } ] },
{ t: "Kundalik işlar", lv: "A1", tip: "He/she/it bilan feʼlga -s qöşiladi: he works, she goes.", l: [
 { t: "Ertalab", w: ["Wake up=Uyğonmoq","Wash=Yuvinmoq","Eat=Yemoq","Drink=İçmoq","Go=Bormoq","Work=İşlamoq","Study=Öqimoq","Sleep=Uxlamoq"],
   s: ["Men soat yettida uyğonaman=I wake up at seven","Men nonuşta qilaman=I eat breakfast","U maktabga boradi=She goes to school","U ofisda işlaydi=He works in an office","Men yuzimni yuvaman=I wash my face","Biz ingliz tilini öqiymiz=We study English"] },
 { t: "Kun tartibi", w: ["In the morning=Ertalab","Afternoon=Tuşdan keyin","Always=Doim","Often=Tez-tez","Sometimes=Baʼzan","Never=Heç qaçon","Early=Erta","Late=Keç"],
   s: ["Men doim erta uyğonaman=I always wake up early","U tez-tez çoy içadi=She often drinks tea","U heç qaçon keç kelmaydi=He never comes late","Biz baʼzan piyoda yuramiz=We sometimes walk","Men ertalab işlayman=I work in the morning","Ular keç uxlaydi=They sleep late"] },
 { t: "Hobbilar", w: ["Read=Öqimoq","Write=Yozmoq","Sing=Kuylamoq","Swim=Suzmoq","Run=Yugurmoq","Play=Öynamoq","Draw=Çizmoq","Cook=Pişirmoq"],
   s: ["U futbol öynaydi=She plays football","Men har kuni yuguraman=I run every day","Biz yozda suzamiz=We swim in summer","Ular rasm çizadi=They draw pictures","U keçki ovqat pişiradi=He cooks dinner","Men kitob öqişni yaxşi köraman=I like to read"] } ] },
{ t: "Uy va şahar", lv: "A2", tip: "There is / there are — biror narsa bor ekanini aytadi.", l: [
 { t: "Uy", w: ["House=Uy","Room=Xona","Kitchen=Oşxona","Bedroom=Yotoq xona","Door=Eşik","Window=Oyna","Bed=Karavot","Chair=Stul"],
   s: ["Bu mening uyim=This is my house","Oşxona katta=The kitchen is big","Xonada karavot bor=There is a bed in the room","Oyna oçiq=The window is open","İltimos eşikni yoping=Close the door please","Men stulda ötiraman=I sit on a chair"] },
 { t: "Şahar", w: ["Street=Köça","Park=Park","School=Maktab","Shop=Dökon","Hospital=Kasalxona","Bank=Bank","Bus=Avtobus","Station=Bekat"],
   s: ["Maktab yaqin=The school is near","Bank qayerda=Where is the bank","Dökon uzoq=The shop is far","Avtobus bu yerda töxtaydi=The bus stops here","Men parkda yuraman=I walk in the park","Kasalxona bu köçada=The hospital is on this street"] },
 { t: "Yönaliş", w: ["Left=Çap","Right=Öng","Straight=Töğri","Near=Yaqin","Far=Uzoq","Turn=Burilmoq","Corner=Burçak","Map=Xarita"],
   s: ["Çapga buriling=Turn left","Öngga buriling=Turn right","Töğri yuring=Go straight","Bank burçakda=The bank is on the corner","U uzoqmi=Is it far","Menga xaritada körsating=Show me on the map"] } ] },
{ t: "Ob-havo", lv: "A2", tip: "Ob-havo haqida gapirganda It is ... işlatiladi: It is sunny.", l: [
 { t: "Ob-havo", w: ["Weather=Ob-havo","Sun=Quyoş","Rain=Yomğir","Snow=Qor","Wind=Şamol","Cloud=Bulut","Sunny=Quyoşli","Rainy=Yomğirli"],
   s: ["Bugun quyoşli=It is sunny today","Yomğir yoğmoqda=It is raining","Ob-havo yaxşi=The weather is nice","Şamol kuçli=The wind is strong","Qor yoğmoqda=It is snowing","Osmonda bulutlar bor=There are clouds"] },
 { t: "Fasllar", w: ["Spring=Bahor","Summer=Yoz","Autumn=Kuz","Winter=Qiş","Hot=İssiq","Cold=Sovuq","Warm=İliq","Cool=Salqin"],
   s: ["Yoz issiq=Summer is hot","Qiş sovuq=Winter is cold","Men bahorni sevaman=I love spring","Kuz salqin=Autumn is cool","Bugun iliq=It is warm today","Bahorda daraxtlar yaşil=The trees are green in spring"] },
 { t: "Kiyim", w: ["Coat=Palto","Hat=Qalpoq","Scarf=Şarf","Gloves=Qölqop","Shoes=Poyabzal","Umbrella=Soyabon","Boots=Etik","Jacket=Kurtka"],
   s: ["Soyabon oling=Take an umbrella","Etigim yangi=My boots are new","Men qişda palto kiyaman=I wear a coat in winter","Kurtka kök=The jacket is blue","Qalpoq kiying=Put on your hat","Uning iliq qölqopi bor=She has warm gloves"] } ] },
{ t: "Xarid", lv: "A2", tip: "Narxni söraş uçun How much is it? deymiz.", l: [
 { t: "Ranglar", w: ["Red=Qizil","Blue=Kök","Green=Yaşil","Yellow=Sariq","Black=Qora","White=Oq","Brown=Jigarrang","Pink=Puşti"],
   s: ["Olma qizil=The apple is red","Osmon kök=The sky is blue","Menga yaşil yoqadi=I like green","Mening maşinam oq=My car is white","Uning qora sumkasi bor=She has a black bag","Banan sariq=The banana is yellow"] },
 { t: "Dökonda", w: ["Money=Pul","Price=Narx","Cheap=Arzon","Expensive=Qimmat","Buy=Sotib olmoq","Sell=Sotmoq","Cash=Naqd","Card=Karta"],
   s: ["Bu qança turadi=How much is it","U juda qimmat=It is very expensive","Bu sumka arzon=This bag is cheap","Men non sotib olmoqçiman=I want to buy bread","Karta bilan tölay olamanmi=Can I pay by card","Mana pulingiz=Here is your money"] },
 { t: "Kiyim xaridi", w: ["Shirt=Köylak","Dress=Libos","Trousers=Şim","Size=Ölçam","Small=Kiçik","Big=Katta","Try on=Ölçab körmoq","Like=Yoqtirmoq"],
   s: ["Men kök köylak xohlayman=I want a blue shirt","Bu libos kiçik=This dress is small","Menga bu şimlar yoqadi=I like these trousers","U juda katta=It is too big","Sizning ölçamingiz qanday=What size are you","Ölçab körsam böladimi=Can I try it on"] } ] },
{ t: "Sayohat", lv: "B1", tip: "Kelasi zamon: I will + feʼl. Masalan: I will travel.", l: [
 { t: "Transport", w: ["Travel=Sayohat","Ticket=Çipta","Train=Poyezd","Plane=Samolyot","Airport=Aeroport","Passport=Pasport","Luggage=Yuk","Taxi=Taksi"],
   s: ["Poyezd soat sakkizda jönaydi=The train leaves at eight","Samolyotim keçikyapti=My plane is late","Aeroport qayerda=Where is the airport","Menga Londonga çipta kerak=I need a ticket to London","Pasportim menda=I have my passport","İltimos taksi çaqiring=Call a taxi please"] },
 { t: "Mehmonxona", w: ["Hotel=Mehmonxona","Reservation=Bron","Key=Kalit","Floor=Qavat","Guest=Mehmon","Stay=Qolmoq","Elevator=Lift","Pool=Basseyn"],
   s: ["Menda bron bor=I have a reservation","Mana kalitingiz=Here is your key","Mening xonam uçinçi qavatda=My room is on the third floor","Siz neça tun qolasiz=How many nights will you stay","Mehmonxonada basseyn bor=The hotel has a pool","Lift u yerda=The elevator is there"] },
 { t: "Rejalar", w: ["Plan=Reja","Trip=Safar","Beach=Plyaj","Mountain=Toğ","Museum=Muzey","Photo=Rasm","Souvenir=Esdalik","Holiday=Dam oliş"],
   s: ["Men muzeyga boraman=I will visit the museum","Men köp rasm olaman=I will take many photos","Biz kelasi yil sayohat qilamiz=We will travel next year","Toğlar çiroyli=The mountains are beautiful","Biz plyajga boramiz=We will go to the beach","Men esdalik sotib olaman=I will buy a souvenir"] } ] },
{ t: "İş va kasblar", lv: "A2", tip: "Kasb haqida: I am a teacher. Kasb oldidan a/an qöyiladi.", l: [
 { t: "Kasblar", w: ["Teacher=Öqituvçi","Doctor=Şifokor","Engineer=Muhandis","Driver=Haydovçi","Chef=Oşpaz","Nurse=Hamşira","Farmer=Dehqon","Lawyer=Advokat"],
   s: ["Men öqituvçiman=I am a teacher","Mening akam muhandis=My brother is an engineer","U yaxşi haydovçi=He is a good driver","Opam hamşira bölib işlaydi=My sister works as a nurse","Oşpaz ovqat pişiradi=The cook makes food","Dehqon dalada işlaydi=The farmer works in the field"] },
 { t: "İş joyi", w: ["Office=Ofis","Job=İş","Boss=Rahbar","Colleague=Hamkasb","Salary=Maaş","Meeting=Yiğiliş","Computer=Kompyuter","Company=Kompaniya"],
   s: ["Men ofisda işlayman=I work in an office","Mening rahbarim yaxşi=My boss is good","Bugun yiğiliş bor=There is a meeting today","Hamkasbim kompyuterda işlaydi=My colleague works on a computer","Maaş yaxşi=The salary is good","U katta kompaniyada işlaydi=He works in a big company"] },
 { t: "Uçraşuv va xat", w: ["Message=Xabar","Email=Elektron xat","Phone=Telefon","Appointment=Uçraşuv","Send=Yubormoq","Receive=Qabul qilmoq","Ready=Tayyor","Busy=Band"],
   s: ["Men xabar yuboraman=I send a message","Men band emasman=I am not busy","Uçraşuv soat uçda=The appointment is at three","Men elektron xat olaman=I receive an email","Hammasi tayyor=Everything is ready","Menga telefon qiling=Call me"] } ] },
{ t: "Salomatlik", lv: "A2", tip: "Oğriq haqida: My head hurts yoki I have a headache.", l: [
 { t: "Tana aʼzolari", w: ["Head=Boş","Eye=Köz","Ear=Quloq","Nose=Burun","Mouth=Oğiz","Hand=Qöl","Leg=Oyoq","Back=Orqa"],
   s: ["Mening boşim oğriyapti=My head hurts","Közlarim yaxşi körmaydi=My eyes do not see well","Quloğim oğriyapti=My ear hurts","Qölim sovuq=My hand is cold","Oyoğim oğriyapti=My leg hurts","Orqam oğriyapti=My back hurts"] },
 { t: "Şifokorda", w: ["Medicine=Dori","Pain=Oğriq","Fever=İsitma","Cough=Yötal","Sick=Kasal","Healthy=Soğlom","Pharmacy=Dorixona","Rest=Dam olmoq"],
   s: ["Men kasalman=I am sick","Menda isitma bor=I have a fever","Menga dori kerak=I need medicine","Dorixona qayerda=Where is the pharmacy","Yötalim kuçli=My cough is strong","Dam olişingiz kerak=You need to rest"] },
 { t: "Soğlom turmuş", w: ["Vegetables=Sabzavot","Fruit=Meva","Health=Soğliq","Exercise=Maşq","Walk=Sayr qilmoq","Strong=Kuçli","Weak=Zaif","Habit=Odat"],
   s: ["Men har kuni meva yeyman=I eat fruit every day","Uyqu soğlik uçun muhim=Sleep is important for health","Men sabzavotlarni yaxşi köraman=I like vegetables","U har kuni maşq qiladi=He exercises every day","Men kuçliman=I am strong","Yaxşi odat muhim=A good habit is important"] } ] },
{ t: "Böş vaqt", lv: "A2", tip: "Yoqtiriş haqida: I like swimming. Feʼlga -ing qöşiladi.", l: [
 { t: "Sport", w: ["Football=Futbol","Basketball=Basketbol","Tennis=Tennis","Team=Jamoa","Player=Öyinçi","Game=Öyin","Ball=Töp","Win=Yutmoq"],
   s: ["Men futbol öynayman=I play football","Bizning jamoamiz yutadi=Our team wins","Öyin soat beşda boşlanadi=The game starts at five","U yaxşi öyinçi=He is a good player","Töp uyda=The ball is at home","Men tennisni yaxşi köraman=I like tennis"] },
 { t: "Musiqa va kino", w: ["Music=Musiqa","Song=Qöşiq","Film=Film","Actor=Aktyor","Guitar=Gitara","Concert=Konsert","Singer=Xonanda","Dance=Raqs"],
   s: ["Men musiqa tinglayman=I listen to music","Bu qöşiq çiroyli=This song is beautiful","Men gitara çalaman=I play the guitar","Biz konsertga boramiz=We go to the concert","U maşhur xonanda=He is a famous singer","Men yangi film kördim=I watched a new film"] },
 { t: "Hafta oxiri", w: ["Saturday=Şanba","Weekend=Hafta oxiri","Picnic=Piknik","Shopping=Xarid","Together=Birga","Invite=Taklif qilmoq","Fun=Qiziqarli","Free=Böş"],
   s: ["Hafta oxiri bizda piknik bor=We have a picnic at the weekend","Men şanba kuni böşman=I am free on Saturday","Biz birga xarid qilamiz=We shop together","Bu juda qiziqarli=It is very fun","Sizni taklif qilaman=I invite you","Hafta oxirida nima qilasiz=What do you do at the weekend"] } ] },
{ t: "Ötgan zamon", lv: "B1", tip: "Ötgan zamon: oddiy feʼllarga -ed qöşiladi (worked). Baʼzilari tartibsiz: go — went.", l: [
 { t: "Keça", w: ["Yesterday=Keça","Worked=İşladim","Played=Öynadim","Studied=Öqidim","Cooked=Pişirdim","Cleaned=Tozaladim","Last week=Ötgan hafta","Ago=Avval"],
   s: ["Keça men işladim=Yesterday I worked","Biz keça futbol öynadik=We played football yesterday","Men keça ingliz tilini öqidim=I studied English yesterday","U keça ovqat pişirdi=She cooked food yesterday","Men uyni tozaladim=I cleaned the house","Ötgan hafta mehmon keldi=A guest came last week"] },
 { t: "Tartibsiz feʼllar", w: ["Went=Bordim","Saw=Kördim","Ate=Yedim","Drank=İçdim","Came=Keldim","Bought=Sotib oldim","Wrote=Yozdim","Had=Bor edi"],
   s: ["Men dökonga bordim=I went to the shop","Biz film kördik=We saw a film","Men non yedim=I ate bread","U çoy içdi=He drank tea","Men xat yozdim=I wrote a letter","Siz keça keldingiz=You came yesterday"] },
 { t: "Hikoya", w: ["Story=Hikoya","Then=Keyin","First=Birinçi","Finally=Nihoyat","Suddenly=Birdan","Because=Çunki","Began=Boşlandi","Ended=Tugadi"],
   s: ["Hikoya soat uçda boşlandi=The story began at three","Keyin biz uyga ketdik=Then we went home","Birdan yomğir yoğdi=Suddenly it rained","Nihoyat dars tugadi=Finally the lesson ended","Men uyga keldim çunki çarçadim=I came home because I was tired","Birinçi men uyga bordim=First I went home"] } ] },
{ t: "Kelajak rejalari", lv: "B1", tip: "Kelasi zamon: will + feʼl (I will study). Reja uçun: going to.", l: [
 { t: "Orzular", w: ["Dream=Orzu","Future=Kelajak","Career=Karyera","Success=Muvaffaqiyat","University=Universitet","Degree=Diplom","Abroad=Xorijda","Famous=Maşhur"],
   s: ["Mening orzum bor=I have a dream","Men diplom olmoqçiman=I want to get a diploma","U maşhur bölmoqçi=He wants to be famous","Kelajak yaxşi böladi=The future will be good","Men xorijda öqimoqçiman=I want to study abroad","Karyera muhim=Career is important"] },
 { t: "Rejalar", w: ["Soon=Tezda","Maybe=Balki","Promise=Vaʼda","Decide=Qaror qilmoq","Start=Boşlamoq","Finish=Tugatmoq","Learn=Örganmoq","Move=Köçmoq"],
   s: ["Men tezda boşlayman=I will start soon","Balki yomğir yoğadi=Maybe it will rain","Men qaror qildim=I decided","Men bu hafta tugataman=I will finish this week","Biz yangi uyga köçamiz=We will move to a new house","Men yangi til örganaman=I will learn a new language"] },
 { t: "Maqsadlar", w: ["Goal=Maqsad","Hope=Umid","Try=Harakat qilmoq","Hard=Qiyin","Easy=Oson","Practice=Amaliyot","Improve=Yaxşilamoq","Believe=İşonmoq"],
   s: ["Mening maqsadim aniq=My goal is clear","Men har kuni harakat qilaman=I try every day","Bu qiyin emas=It is not hard","Amaliyot muhim=Practice is important","Men umid qilaman=I hope so","Men ingliz tilimni yaxşilayman=I improve my English"] } ] },
];
export const UNITS = [...BASE, ...A1, ...A2, ...B1, ...B2];

export const PER = 3;
export const TOTAL = UNITS.length * PER;
// The learn map groups chapters into "galaxies" of 20, in course order.
export const WORLDS = [
  { name: "Orion", sub: "İlk qadamlar", from: 1, to: 20 },
  { name: "Andromeda", sub: "Kundalik hayot", from: 21, to: 40 },
  { name: "Pleyadalar", sub: "Erkin muloqot", from: 41, to: 60 },
  { name: "Arslon", sub: "Regulus sari", from: 61, to: 80 },
];
export const chapterOf = (lessonId) => Math.ceil(lessonId / PER);
export const WORD_COUNT = new Set(UNITS.flatMap((u) => u.l.flatMap((l) => l.w.map((x) => x.slice(0, x.indexOf("=")).toLowerCase())))).size;
export const PARTS = ["Sözlar", "Eşitiş", "Tarjima", "Takrorlaş"];
const sh = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const sp = (x) => { const i = x.indexOf("="); return [x.slice(0, i), x.slice(i + 1)]; };

export function getLesson(id) {
  if (!Number.isInteger(id) || id < 1 || id > TOTAL) return null;
  return UNITS[Math.floor((id - 1) / PER)].l[(id - 1) % PER];
}
export function lessonWords(id) {
  const L = getLesson(id);
  return L ? L.w.map((x) => { const [en, uz] = sp(x); return { en, uz }; }) : [];
}
export function buildExercises(id) {
  const L = getLesson(id);
  if (!L) return [];
  const W = lessonWords(id);
  const S = L.s.map((x) => { const [uz, en] = sp(x); return { uz, en }; });
  const enT = [...new Set(S.flatMap((s) => s.en.split(" ")))];
  const uzT = [...new Set(S.flatMap((s) => s.uz.split(" ")))];
  const bank = (ans, pool) => [...ans, ...sh(pool.filter((t) => !ans.includes(t))).slice(0, 2)];
  const pick = (w, to) => {
    const options = sh([w[to], ...sh(W.filter((x) => x !== w && x[to] !== w[to])).slice(0, 2).map((x) => x[to])]);
    return { options, answer: options.indexOf(w[to]) };
  };
  const E = [];
  const add = (part, type, data) => E.push({ part, type, data });
  const OK = "Töğri tarjimani tanlang";
  W.slice(4).forEach((w) => add(1, "choice", { prompt: OK, question: w.uz, word: w.en, ...pick(w, "en") }));
  add(1, "match", { prompt: "Juftliklarni toping", pairs: W.slice(0, 4).map((w) => [w.en, w.uz]) });
  [S[0], S[1]].forEach((s) => add(2, "listen", { prompt: "Eşitganingizni yozing", text: s.en, words: bank(s.en.split(" "), enT), answer: s.en.split(" ") }));
  [W[0], W[1]].forEach((w) => add(2, "listenpick", { prompt: "Eşitgan söz tarjimasini tanlang", text: w.en, word: w.en, ...pick(w, "uz") }));
  [S[2], S[3]].forEach((s) => add(3, "build", { prompt: "İngliz tiliga tarjima qiling", source: s.uz, words: bank(s.en.split(" "), enT), answer: s.en.split(" ") }));
  [W[2], W[3]].forEach((w) => add(3, "choice", { prompt: OK, question: w.en, word: w.en, ...pick(w, "uz") }));
  add(4, "match", { prompt: "Juftliklarni toping", pairs: W.slice(4).map((w) => [w.en, w.uz]) });
  [S[4], S[5]].forEach((s) => add(4, "build", { prompt: "Özbek tiliga tarjima qiling", source: s.en, words: bank(s.uz.split(" "), uzT), answer: s.uz.split(" ") }));
  return E;
}
