import { useAuth } from '.app/context/AuthContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const BODY_PARTS = [
  { key: 'head', label: 'Head', injuries: ['Concussion', 'Migraine', 'Whiplash'] },
  { key: 'neck', label: 'Neck', injuries: ['Strain', 'Whiplash'] },
  { key: 'chest', label: 'Chest', injuries: ['Rib Fracture', 'Muscle Strain'] },
  { key: 'abdomen', label: 'Abdomen', injuries: ['Muscle Strain', 'Hernia'] },
  { key: 'leftShoulder', label: 'Left Shoulder', injuries: ['Rotator Cuff Injury', 'Dislocation', 'Impingement'] },
  { key: 'rightShoulder', label: 'Right Shoulder', injuries: ['Rotator Cuff Injury', 'Dislocation', 'Impingement'] },
  { key: 'leftArm', label: 'Left Arm', injuries: ['Biceps Tear', 'Fracture'] },
  { key: 'leftHand', label: 'Left Hand', injuries: ['Sprain', 'Fracture'] },
  { key: 'leftLeg', label: 'Left Leg', injuries: ['ACL Tear', 'Fracture'] },
  { key: 'leftFoot', label: 'Left Foot', injuries: ['Sprain', 'Fracture'] },
  { key: 'rightArm', label: 'Right Arm', injuries: ['Biceps Tear', 'Fracture'] },
  { key: 'rightHand', label: 'Right Hand', injuries: ['Sprain', 'Fracture'] },
  { key: 'rightLeg', label: 'Right Leg', injuries: ['ACL Tear', 'Fracture'] },
  { key: 'rightFoot', label: 'Right Foot', injuries: ['Sprain', 'Fracture'] },
];

// Each path is clipped and positioned as in your SVG file
const PART_PATHS = {
  chest: "M371 345L432 358L450 466L389 510L341 493V442L318 415L353 400L371 345Z M539 345L570 395.207H607L595 421V473L545 507L478.407 461L484.407 355.207L539 345Z",
  leftArm: "M273 489L303 531L263 656L184 689V670L240 537L273 489Z M224 503L178 680L190 558L224 503Z M261 664L252 692L186 731V701L261 664Z M170 699L180 745L98 921L80 911L116 791L170 699Z M243 723L229 784L128 934L105 928L194 742L243 723Z",
  leftFoot: "M370 1659L388 1689L382 1749H370L366 1737L361 1749L307 1747L302 1728L324 1681L370 1659Z",
  leftHand: "M70 918L85 945L123 950C123 950 124.421 980.765 126 1001C128.63 1034.71 111 1088 111 1088H100L107 1049L96 1044L83 1085L70 1083L81 1037L72 1031L55 1076L41 1075L58 1024L49 1019L27 1069L17 1067L41 984L37 971L6 991L0 984L27 945L70 918Z",
  leftLeg: "M303.067 889L313 986.5L280 1188.5V1051L303.067 889Z M318 892.5L431 1065V1141L397 1053L321 974.5L318 892.5Z M320 989.5L375 1079L401 1179.5L387 1273L332 1179.5L310 1065.5L320 989.5Z M397.5 1101.5L430 1165.5L411 1285.5L394.5 1273.5L411 1160.5L397.5 1101.5Z M309 1080.5V1180.5L371 1255L349 1285L296.531 1180.5L309 1080.5Z M341 906.5L419 957L395 987L341 906.5Z M424 960L442 985.033L439 1052L399 993.033L424 960Z M296 1235L320.847 1335L307 1325L296 1385L296 1235Z M330 1297H364L375 1313L354 1379H336V1337L323 1321L330 1297Z M395 1302V1360L365 1456L355 1398L395 1302Z M309.708 1338L342.708 1410L337.708 1556L355.708 1640H337.708L293 1476L309.708 1338Z M390 1395L409 1451L401 1515L382.5 1551L369 1645L367 1551V1481L390 1395Z",
  rightShoulder: "M371 271L390 323H341L309 307L371 271Z M271 322H289.916L236 422.214V378L271 322Z M294.916 326.215H335.916L310.916 413.214L271.916 436.214L240.916 488.214V426.214L294.916 326.215Z",
  leftShoulder: "M626 329L724 405L732 474L702 437L652 419L592 365L626 329Z M650 312L718 370L730 405L632 321L650 312Z M550 264L634 314L602 328L539 314L550 264Z",
  head: "M384.676 52.0227L383.663 109.666L372 108.513L375 141.023L390.663 147.023L402.676 197.023L434.676 249.023H492.676L528.676 197.023L536.676 142.023L550.676 131.023L552.676 102.023L541.676 103.023L540.676 48.1035C540.676 48.1035 497.105 -1.20805 460.676 0.0226593C424.734 1.23689 384.676 52.0227 384.676 52.0227Z",
  neck: "M398.27 219L440.297 272.9L464 345L416.757 330.3L388 246.3L398.27 219Z M530 219L537 235L514 317L470 345L484 275L530 219Z",
  rightArm: "M656 474L626 516L666 641L745 674V655L689 522L656 474Z M704 509L752 647L739 537L704 509Z M667 652L676 680L742 719V689L667 652Z M748 680V735L816 896L832 888L802 772L748 680Z M680 699L694 760L780 912L806 900L730 724L680 699Z",
  rightFoot: "M514 1659L496 1689L502 1749H514L518 1737L523 1749L577 1747L582 1728L560 1681L514 1659Z",
  rightHand: "M838.268 902L823.268 929L784.267 938C784.267 938 783.846 964.765 782.267 985C779.638 1018.71 797.268 1072 797.268 1072H808.268L801.268 1033L812.268 1028L825.268 1069L838.268 1067L827.268 1021L836.268 1015L853.268 1060L867.268 1059L850.268 1008L859.268 1003L881.268 1053L891.267 1051L867.268 968L871.268 955L902.267 975L908.267 968L881.268 929L838.268 902Z",
  rightLeg: "M612.933 876L603 973.5L626 1178L636 1048L612.933 876Z M594 900L491 1084L484 1180.5L518 1092.5L594 988V900Z M594 1003L535 1086.5L509 1187L523 1280.5L578 1187L600 1073L594 1003Z M512.5 1132L480 1196L499 1316L515.5 1304L499 1191L512.5 1132Z M604 1094L595 1194L551 1260L567 1286L616.469 1194L604 1094Z M572 903L506 962.5L532 985.5L572 903Z M502 967L490 987.033L493 1054L533 995.033L502 967Z M609.846 1236L585 1336L598.846 1326L609.847 1386L609.846 1236Z M569 1300H535L524 1316L545 1382H563V1340L576 1324L569 1300Z M503 1313V1371L537 1467L543 1409L503 1313Z M593 1344L560 1416L565 1562L547 1640L565 1644L609.708 1482L593 1344Z M504 1395L491 1451L499 1515L517.5 1551L531 1645L533 1551V1481L504 1395Z",
  abdomen: "M447 509L446 552L395 583V539L447 509Z M446 571V625L394 634V603L446 571Z M445 637L444 715L399 692V651L445 637Z M444 735V815L459 915L401 837V719L444 735Z M485 730V810L470 910L528 832V714L485 730Z M477 509L539 529V573L479 548L477 509Z M482 565L534 594L538 635L482 621V565Z M530 651L535 695L483 708V640L530 651Z M375 525L339 561L319 505L375 525Z M373 536L376 582L342 568L373 536Z M379 594L385.5 652L348 624L341 576L379 594Z M385 659V713L348 689L350 632L385 659Z M377 725L387 779V884L361 886L318 818L336 750L339 706L377 725Z M553 518L589 554L609 498L553 518Z M554 529L551 575L585 561L554 529Z M551.5 587L545 645L582.5 617L589.5 569L551.5 587Z M546 651V705L583 681L581 624L546 651Z M552 715L542 769V874L568 876L611 808L593 740L590 696L552 715Z",
};

export default function SelectInjuriesScreen() {
  const { updateUserInjuries } = useAuth();
  const router = useRouter();
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedInjuries, setSelectedInjuries] = useState([]);

  const handlePartPress = (part) => setSelectedPart(part);

  const handleInjuryToggle = (injury) => {
    setSelectedInjuries((prev) =>
      prev.includes(injury)
        ? prev.filter((i) => i !== injury)
        : [...prev, injury]
    );
  };

  const handleContinue = async () => {
    if (selectedInjuries.length === 0) {
      Alert.alert('Please select at least one injury.');
      return;
    }
    await updateUserInjuries(selectedInjuries);
    router.replace('/(tabs)');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Select Your Injuries</Text>
      <View style={styles.bodyContainer}>
        <Svg width={320} height={615} viewBox="0 0 909 1749">
          {BODY_PARTS.map((part) => (
            <Path
              key={part.key}
              d={PART_PATHS[part.key]}
              fill={selectedPart === part.key ? "#007AFF" : "#b3d1ff"}
              stroke="#333"
              strokeWidth={selectedPart === part.key ? 3 : 1}
              onPress={() => handlePartPress(part.key)}
            />
          ))}
        </Svg>
      </View>
      {selectedPart && (
        <View style={styles.injuryList}>
          <Text style={styles.subtitle}>
            Select Injuries for {BODY_PARTS.find(p => p.key === selectedPart).label}:
          </Text>
          {BODY_PARTS.find(p => p.key === selectedPart).injuries.map((injury) => (
            <TouchableOpacity
              key={injury}
              style={[
                styles.injuryItem,
                selectedInjuries.includes(injury) && styles.selectedInjury
              ]}
              onPress={() => handleInjuryToggle(injury)}
            >
              <Text style={styles.injuryText}>{injury}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  bodyContainer: { width: 320, height: 615, marginBottom: 20, alignItems: 'center', justifyContent: 'center' },
  injuryList: { width: '100%', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  injuryItem: { padding: 12, borderRadius: 8, backgroundColor: '#f0f0f0', marginBottom: 8 },
  selectedInjury: { backgroundColor: '#007AFF22' },
  injuryText: { fontSize: 16 },
  continueButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  continueText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});