export function convertXmlToTree(xmlData: Element): any {
    return {
      name: xmlData.nodeName,
      attributes: getAttributes(xmlData),
      children: Array.from(xmlData.children).map((child) =>
        convertXmlToTree(child as Element)
      ),
    };
  }
  
  function getAttributes(node: Element): Record<string, string> {
    const attributes: Record<string, string> = {};
    for (let i = 0; i < node.attributes.length; i++) {
      const attribute = node.attributes[i];
      if (attribute.nodeValue !== null) {
        attributes[attribute.nodeName] = attribute.nodeValue;
      }
    }
    return attributes;
  }
  